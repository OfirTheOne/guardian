
import { GuardianLayer } from './../models/guardian-layer'
import { GuardianOptions } from './../models/guardian-options'
import { GuardianLegion } from './guardian-legion';
import { getNestedElementByPath } from '../utils/traveler';


export class Guardian {


    private guardianLayers: Array<GuardianLayer> = []
    private target: any;

    public on(options: GuardianOptions): GuardianLegion;
    public on(path: string): GuardianLegion;
    public on(optionsOrPath: string | GuardianOptions): GuardianLegion {
        
        return new GuardianLegion((layer: GuardianLayer) => {
            if(typeof optionsOrPath == 'string') {
                layer.path = optionsOrPath;
            } else {
                layer = {
                    ...optionsOrPath,
                    ...layer
                }
                // .path = path.path;
                // layer.errorMassage = path.errorMassage;
                // layer.optional = path.optional;
            }
            this.pushLayer(layer);
        })
    }


    private pushLayer(layer: GuardianLayer) {
        this.guardianLayers.push(layer);
    }
    private async execLayer(layer: GuardianLayer) {
        try {
            const { 
                each = false,
                path = '', 
                optional = false, 
                guardFunction,
                errorMassage
            } = layer;

            // get target
            const inTarget = getNestedElementByPath(this.target, path)

            // exec function
            let result;
            if(each && Array.isArray(inTarget)) {
                result = await Promise.all(inTarget.map(async targetItem => await guardFunction(targetItem)));
                result = (result as Array<any>).every(val => val == true)
            } else {
                result = await guardFunction(inTarget);
            }

            // check result
            if(!result) {
                throw Error(errorMassage)
            }

        } catch(error) {
            throw error;
        }
    }


    public compile(target: any) {
        this.target = target;
    }
    public async run() {
        
        const errors = [];

        for(let layer of this.guardianLayers) {

            try {
                await this.execLayer(layer);
            } catch (error) {
                errors.push(error);
            }
        }

        return errors;
    }

    public layersSummery(prettyPrint: boolean): void 
    public layersSummery(): Array<any> 
    public layersSummery(prettyPrint = true): (void | Array<any>) {

        const summary = this.guardianLayers.map(({name, path}, i) => ({Layer: i+1, Name: name, Path: path }));
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



