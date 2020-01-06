import { GuardianOptions } from "./../models/guardian-options";
import { SequentialLayer } from "./../models/sequential-layer";
import { LayerOperation } from "./../models/layer-operation";
import { GuardianLayer } from "../models/guardian-layer";

export class LayerAttacher {

    
    constructor(
            private stateOptions: Partial<GuardianOptions>, 
            private guardianLayers: Array<GuardianLayer>,
            private onAttchment?: (stateOptions: Partial<GuardianOptions>, sequentialLayer: Array<SequentialLayer>) => void) {

    }

    public add(operations: (Array<LayerOperation> | LayerOperation)) {

        const operationsAsArray = Array.isArray(operations) ? operations : [operations] ;

        const sequentialLayers: Array<SequentialLayer> = operationsAsArray.map((op, i) => op({
            ...this.stateOptions,
            layerKey: `${this.stateOptions.layerKey}:${i}`
        }))

        this.guardianLayers.push({
            options: this.stateOptions as GuardianOptions,
            sequances: sequentialLayers
        }
        );
        // this.onAttchment(this.stateOptions, this.sequentialLayers);
    }

}