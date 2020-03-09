
import { GuardianLayer } from './../../models/guardian-layer'
import { GuardianOptions } from './../../models/guardian-options'
import { getNestedElementByPath } from '../../utils/traveler';
import { LayerAttacher } from './../../inner/layer-attacher';
import { LayerKeyNotFound } from './../../errors';


const DEFAULT_GUARDIAN_CONFIG = {
    eager: false 
}

export class Guardian {

    // private sequentialLayers: Array<SequentialLayer> = [];

    
    // private guardianLayers: Array<GuardianLayer> = [];
    
    // private guardianLayersMap: Map<string, number> = new Map<string, number>();
    
    // private resolvementCache: Map<string, {resolvement: boolean, error?: any }> = new Map<string, {resolvement: boolean, error?: any }>();
    
    
    
    
    
    // 
    private orReductionGroupStack: Array<{ keys: Set<string>, resolvement: boolean }> = [];

    private layersStack: Array<string> = [];
    private definitionPool: Map <string, GuardianLayer> = new Map <string, GuardianLayer>();
    private resolvementCache: Map <string, { result: boolean, error?: any}> = new Map <string, { result: boolean, error?: any}>();





    private target: any;

    constructor(private config: { eager: boolean } = DEFAULT_GUARDIAN_CONFIG) {}

    public on(options: GuardianOptions): LayerAttacher;
    public on(path: Array<string>): LayerAttacher;
    public on(path: string): LayerAttacher;
    public on(optionsOrPath: (string | Array<string> | GuardianOptions) ): LayerAttacher {
        
        const layerOptions = this._handlerInitialLayerOptions(optionsOrPath);

        return new LayerAttacher(
            layerOptions,
            this.definitionPool,
            this.layersStack
        );
    }

    private _pickNewLayerKey(existingKeys: Map<string, any>, suggestedKey: string|number) {

        let layerKey: GuardianOptions['layerKey'] = suggestedKey;

        if(suggestedKey == undefined) {
            layerKey = existingKeys.size + 1;
        } else if(existingKeys.has(`${suggestedKey}`)) {
            console.warn('duplicate layer key, fallback to layer level.'); 
            layerKey = (existingKeys.size + 1)
        }
        return layerKey;
    }

    private _handlerInitialLayerOptions(optionsOrPath: string | GuardianOptions | Array<string>): Partial<GuardianOptions> {
        let layerOptions: Partial<GuardianOptions>  = {};

        let layerKey: GuardianOptions['layerKey'] = this._pickNewLayerKey(this.definitionPool, undefined);
        if(typeof optionsOrPath == 'string' || Array.isArray(optionsOrPath)) {
            layerOptions.path = optionsOrPath;
        } else {
            if(optionsOrPath.layerKey) {
                layerKey = this._pickNewLayerKey(this.definitionPool, optionsOrPath.layerKey);
            }

            layerOptions = {
                ...optionsOrPath,
                layerKey
            }
        }
        return layerOptions;
    }
    private async _execLayer(rootTarget: any, layer: GuardianLayer) {
        try {
            let { 
                each = false,
                path = [''], 
                optional = false, 
                errorMessage,
                layerKey
            } = layer.options;

            const { sequences } = layer;
            
            path = Array.isArray(path) ? path : [path];
            for(let targetPath of path) {
                // get target
                const inTarget = getNestedElementByPath(rootTarget, targetPath)
                let result;

                for(let sequence of sequences) {
                    const { action } = sequence;

                    

                    // exec function
                    if(each && Array.isArray(inTarget)) {

                        result = await Promise.all(
                            inTarget.map(async targetItem => { 
                                return await this._execSingleAction(action, targetItem, optional);
                            })
                        );
                        result = (result as Array<any>).every(val => val == true)
                    } else {
                        result = await this._execSingleAction(action, inTarget, optional);
                    }
                    // check result
                    if(!result) {
                        throw { message: errorMessage, target: inTarget, path: targetPath, layerKey};
                    }
                }

    
            }


        } catch(error) {
            throw error;
        }
    }

    private async _execSingleAction(action: Function, value: any, optional: boolean) {
        return (optional && (value == undefined || value == null)) 
            || await action(value);
    }

    private _addReductionGroup(keys: Array<string>) {
        const keysSet = new Set<string>(keys);
        this.orReductionGroupStack.push({ keys: keysSet, resolvement: undefined });
    }
    private _updateResolvementCache(layerKey: string, result: boolean, error?: any) {
        this.resolvementCache.set(`${layerKey}`, {result, error});
    }



    public orReduction(...keys: Array<string>) {
        const notFoundKeys = keys.filter(k => !this.definitionPool.has(k));
        if(notFoundKeys.length) {
            throw new LayerKeyNotFound(keys);
        }
        this._addReductionGroup(keys);
        this.layersStack = this.layersStack.filter(layerKey => !keys.includes(layerKey));
    }

    public compile(target: any) {
        this.target = target;
    }
    public async run() {

        const layersStack = this.layersStack;
        const definitionPool = this.definitionPool;
        const errors = [];

        // #region - or groups execution
        for(let group of this.orReductionGroupStack) {
            const groupErrors = []
            const keysArray = Array.from(group.keys.values())            

    
            for(let layerKey of keysArray) {
                const layer = definitionPool.get(`${layerKey}`);
                
                if(this.resolvementCache.has(`${layerKey}`)) {
                    // layer was resolved
                    const { result, error } = this.resolvementCache.get(`${layerKey}`);
                    if(result == false) {
                        groupErrors.push(error);
                    } else if(result == true) {
                        break;
                    }
                } else {
                    try {
                        await this._execLayer(this.target, layer);
                        this._updateResolvementCache(`${layerKey}`, true);
    
                    } catch (error) {
                        groupErrors.push(error);
                        this._updateResolvementCache(`${layerKey}`, false, error);
                    }
                }
            }


            const groupValid = groupErrors.length < group.keys.size;

            if(!groupValid) {
                errors.push(...groupErrors);
                if(this.config.eager) {
                    // first error will stop the layer execution loop
                    return errors;
                }
            }

        }
        // #endregion 



        // #region - single layer execution
        for(let layerKey of layersStack) { 
            const layer = definitionPool.get(`${layerKey}`);

            try {
                await this._execLayer(this.target, layer);
                this._updateResolvementCache(`${layerKey}`, true);


            } catch (error) {
                errors.push(error);
                this._updateResolvementCache(`${layerKey}`, false, error);
                
                if(this.config.eager) {
                    // first error will stop the layer execution loop
                    break;
                }
            }
        }
        // #endregion 

        return errors;
    }


    // public ref(key: string) {

    // }


    public disable(layerKey: number|string) {
        this.definitionPool.has(`${layerKey}`) ? 
            this.definitionPool.get(`${layerKey}`).options.disabled = true :
            console.warn('layerKey not found.')

    }
    public stackSummary(prettyPrint: boolean): void 
    public stackSummary(): Array<any> 
    public stackSummary(prettyPrint = true): (void | Array<any>) {

        const groupSummary = this.orReductionGroupStack
            .map(group => Array.from(group.keys.values()).map(key => this.definitionPool.get(key)))
            .reduce((acc, groupAsArray, i) =>  [
                ...acc, 
                ...groupAsArray.map(({sequences, options}) => ({
                    Layer: `OR/${i+1}`, 
                    Name: sequences.map(({name}) => name), 
                    Path: options.path,
                    Key: options.layerKey,
                    
                }))
            ] , []);

        const singleSummary = this.layersStack
            .map(key => this.definitionPool.get(`${key}`))
            .map(({sequences, options}, i) => ({
                Layer: i+1, 
                Name: sequences.map(({name}) => name), 
                Path: options.path,
                Key: options.layerKey,
                
            }));
        return prettyPrint ? 
            console.table([...groupSummary, ...singleSummary]) : 
            [...groupSummary, ...singleSummary]
    }

    public toMiddleware(target?: Function );
    public toMiddleware(target?: string );
    public toMiddleware(target?: (string | Function) ) {
        return async (req, res, next) => {
            try {
                const o = target == undefined ? 
                    ({req, res}) :
                    (
                        typeof target == 'string' ? 
                            getNestedElementByPath({ req, res }, target) : 
                            target({ req, res })
                    );
                this.compile(o);
                const errors = await this.run()
                return errors.length > 0 ? next(errors): next();
            } catch (error) {
                throw error;
            }
        }
    }

}



