import { GuardianOptions } from "./../models/guardian-options";
import { SequentialLayer } from "./../models/sequential-layer";
import { LayerOperation } from "./../models/layer-operation";

export class LayerAttacher {

    
    constructor(
            private stateOptions: Partial<GuardianOptions>, 
            private sequentialLayers: Array<SequentialLayer>,
            private onAttchment?: (stateOptions: Partial<GuardianOptions>, sequentialLayer: Array<SequentialLayer>) => void) {

    }

    public add(operations: (Array<LayerOperation> | LayerOperation)) {

        const operationsAsArray = Array.isArray(operations) ? operations : [operations] ;

        const sequentialLayers: Array<SequentialLayer> = operationsAsArray.map((op, i) => op({
            ...this.stateOptions,
            layerKey: `${this.stateOptions.layerKey}:${i}`
        }))

        this.sequentialLayers.push(
            ...( sequentialLayers )
        );
        // this.onAttchment(this.stateOptions, this.sequentialLayers);
    }

}