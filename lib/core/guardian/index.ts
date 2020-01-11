
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
    private defenitionPool: Map <string, GuardianLayer> = new Map <string, GuardianLayer>();
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
            this.defenitionPool,
            this.layersStack
        );
    }

    private _pickNewLayerKey(exsitngKeys: Map<string, any>, suggestedKey: string|number) {

        let layerKey: GuardianOptions['layerKey'] = suggestedKey;

        if(suggestedKey == undefined) {
            layerKey = exsitngKeys.size + 1;
        } else if(exsitngKeys.has(`${suggestedKey}`)) {
            console.warn('duplicate layer key, fallback to layer level.'); 
            layerKey = (exsitngKeys.size + 1)
        }
        return layerKey;
    }

    private _handlerInitialLayerOptions(optionsOrPath: string | GuardianOptions | Array<string>): Partial<GuardianOptions> {
        let leyerOptions: Partial<GuardianOptions>  = {};

        let layerKey: GuardianOptions['layerKey'] = this._pickNewLayerKey(this.defenitionPool, undefined);
        if(typeof optionsOrPath == 'string' || Array.isArray(optionsOrPath)) {
            leyerOptions.path = optionsOrPath;
        } else {
            if(optionsOrPath.layerKey) {
                layerKey = this._pickNewLayerKey(this.defenitionPool, optionsOrPath.layerKey);
            }

            leyerOptions = {
                ...optionsOrPath,
                layerKey
            }
        }
        return leyerOptions;
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

            const { sequances } = layer;
            
            path = Array.isArray(path) ? path : [path];
            for(let targetPath of path) {
                // get target
                const inTarget = getNestedElementByPath(rootTarget, targetPath)
                let result;

                for(let sequance of sequances) {
                    const { action } = sequance;
                    // exec function
                    if(each && Array.isArray(inTarget)) {

                        result = await Promise.all(inTarget.map(async targetItem => await action(targetItem)));
                        result = (result as Array<any>).every(val => val == true)
                    } else {
                        result = await action(inTarget);
                    }
                    // check result
                    if(!result) {
                        throw { massege: errorMessage, target: inTarget, path: targetPath, layerKey};
                    }
                }

    
            }


        } catch(error) {
            throw error;
        }
    }


    private _addReductionGroup(keys: Array<string>) {
        const keysSet = new Set<string>(keys);
        this.orReductionGroupStack.push({ keys: keysSet, resolvement: undefined });
    }
    private _updateResolvementCache(layerKey: string, result: boolean, error?: any) {
        this.resolvementCache.set(`${layerKey}`, {result, error});
    }



    public orReduction(...keys: Array<string>) {
        const unfoundKeys = keys.filter(k => !this.defenitionPool.has(k));
        if(unfoundKeys.length) {
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
        const defenitionPool = this.defenitionPool;
        const errors = [];

        // #region - or groups execution
        for(let group of this.orReductionGroupStack) {
            const groupErrors = []
            const keysArray = Array.from(group.keys.values())            

    
            for(let layerKey of keysArray) {
                const layer = defenitionPool.get(`${layerKey}`);
                
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
            const layer = defenitionPool.get(`${layerKey}`);

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
        this.defenitionPool.has(`${layerKey}`) ? 
            this.defenitionPool.get(`${layerKey}`).options.disabled = true :
            console.warn('layerKey not found.')

    }
    public stackSummery(prettyPrint: boolean): void 
    public stackSummery(): Array<any> 
    public stackSummery(prettyPrint = true): (void | Array<any>) {

        const groupSummary = this.orReductionGroupStack
            .map(group => Array.from(group.keys.values()).map(key => this.defenitionPool.get(key)))
            .reduce((acc, groupAsArray, i) =>  [
                ...acc, 
                ...groupAsArray.map(({sequances, options}) => ({
                    Layer: `OR/${i+1}`, 
                    Name: sequances.map(({name}) => name), 
                    Path: options.path,
                    Key: options.layerKey,
                    
                }))
            ] , []);

        const singleSummary = this.layersStack
            .map(key => this.defenitionPool.get(`${key}`))
            .map(({sequances, options}, i) => ({
                Layer: i+1, 
                Name: sequances.map(({name}) => name), 
                Path: options.path,
                Key: options.layerKey,
                
            }));
        return prettyPrint ? 
            console.table([...groupSummary, ...singleSummary]) : 
            [...groupSummary, ...singleSummary]
    }

    public toMiddleware(target: (string | Function) ) {
        return async (req, res, next) => {
            try {
                const o = typeof target == 'string' ? getNestedElementByPath({ req, res }, target) : target({ req, res })
                this.compile(o);
                const errors = await this.run()
                return errors.length > 0 ? next(errors): next();
            } catch (error) {
                throw error;
            }
        }
    }

}



