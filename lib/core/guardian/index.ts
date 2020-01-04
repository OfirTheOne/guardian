
import { GuardianLayer } from './../../models/guardian-layer'
import { GuardianOptions } from './../../models/guardian-options'
import { getNestedElementByPath } from '../../utils/traveler';
import { SequentialLayer } from './../../models/sequential-layer';
import { LayerAttacher } from './../../inner/layer-attacher';


const DEFAULT_GUARDIAN_CONFIG = {
    eager: false 
}

export class Guardian {

    private sequentialLayers: Array<SequentialLayer> = [];

    //private guardianLayers: Array<GuardianLayer> = [];

    private guardianLayersMap: Map<string, number> = new Map<string, number>();

    private target: any;

    constructor(private config: { eager: boolean } = DEFAULT_GUARDIAN_CONFIG) {}

    public on(options: GuardianOptions): LayerAttacher;
    public on(path: Array<string>): LayerAttacher;
    public on(path: string): LayerAttacher;
    public on(optionsOrPath: (string | Array<string> | GuardianOptions) ): LayerAttacher {
        
        const layerOptions = this._handlerInitialLayerOptions(optionsOrPath);

        return new LayerAttacher(
            layerOptions,
            this.sequentialLayers,

        );
    }


    private _handlerInitialLayerOptions(optionsOrPath: string | GuardianOptions | Array<string>): Partial<GuardianOptions> {
        let leyerOptions: Partial<GuardianOptions>  = {};

        let layerKey: GuardianLayer['layerKey'] = this.sequentialLayers.length + 1;
        if(typeof optionsOrPath == 'string' || Array.isArray(optionsOrPath)) {
            leyerOptions.path = optionsOrPath;
        } else {
            if(optionsOrPath.layerKey) {
                this.guardianLayersMap.has(`${optionsOrPath.layerKey}`) ? 
                    console.warn('duplicate layer key, fallback to layer level.') : 
                    layerKey = (optionsOrPath.layerKey != undefined ? optionsOrPath.layerKey : (this.sequentialLayers.length + 1));
            }

            leyerOptions = {
                ...optionsOrPath,
                layerKey
            }
        }
        return leyerOptions;
    }

    private _sequentialToGuardianLayer(sequential: SequentialLayer): GuardianLayer {
        return {
            ...sequential.options,
            path: sequential.options.path,
            guardAction: sequential.action,
            name: sequential.name
        }
    }
    // private _pushLayer(layer: GuardianLayer) {
    //     this.guardianLayers.push(layer);
    // }    
    private _processSequential(sequentialLayers: Array<SequentialLayer>) {
        return sequentialLayers
            .map(seq => this._sequentialToGuardianLayer(seq))
            // .forEach(grd => {
            //     this._pushLayer(grd);
            //     this.guardianLayersMap.set(`${grd.layerKey}`, this.guardianLayers.length-1)
            // });
    }


    private async _execLayer(layer: GuardianLayer) {
        try {
            let { 
                each = false,
                path = [''], 
                optional = false, 
                guardAction,
                errorMessage
            } = layer;

            path = Array.isArray(path) ? path : [path];
            for(let targetPath of path) {
                // get target
                debugger;
                const inTarget = getNestedElementByPath(this.target, targetPath)
                let result;

                // exec function
                if(each && Array.isArray(inTarget)) {
                    result = await Promise.all(inTarget.map(async targetItem => await guardAction(targetItem)));
                    result = (result as Array<any>).every(val => val == true)
                } else {
                    result = await guardAction(inTarget);
                }

    
                // check result
                if(!result) {
                    throw { massege: errorMessage, target: inTarget, path};
                }
            }


        } catch(error) {
            throw error;
        }
    }


    public compile(target: any) {
        this.target = target;
    }
    public async run() {
        const guardianLayers = this._processSequential(this.sequentialLayers); // convert sequantioal to guardian layer

        const errors = [];

        for(let layer of guardianLayers) {

            try {
                await this._execLayer(layer);
            } catch (error) {
                errors.push(error);
                if(this.config.eager) {
                    // first error will stop the layer execution loop
                    break;
                }
            }
        }

        return errors;
    }

/*
    public add(sequentialLayer: (Array<SequentialLayer> | SequentialLayer)) {

        this.sequentialLayers.push(
            ...( Array.isArray(sequentialLayer) ? sequentialLayer : [sequentialLayer] )
        );
    }
*/

    // public ref(key: string) {

    // }
    // public or() {

    // }
    public disable(layerKey: number|string) {
        this.guardianLayersMap.has(`${layerKey}`) ? 
            this.sequentialLayers[this.guardianLayersMap.get(`${layerKey}`)].options.disabled = true :
            console.warn('layerKey not found.')

    }
    public layersSummery(prettyPrint: boolean): void 
    public layersSummery(): Array<any> 
    public layersSummery(prettyPrint = true): (void | Array<any>) {

        const summary = this.sequentialLayers.map(({name, options}, i) => ({
            Layer: i+1, 
            Name: name, 
            Path: options.path,
            Key: options.layerKey
        }));
        return prettyPrint ? 
            console.table(summary) : 
            summary
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



