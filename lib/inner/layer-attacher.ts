import { GuardianOptions } from "./../models/guardian-options";
import { SequentialLayer } from "./../models/sequential-layer";
import { LayerOperation } from "./../models/layer-operation";
import { GuardianLayer } from "../models/guardian-layer";

export class LayerAttacher {

    
    constructor(
            private stateOptions: Partial<GuardianOptions>, 
            private definitionPool: Map <string, GuardianLayer> = new Map <string, GuardianLayer>(),
            private layersStack: Array<string|Set<string>> ,
            private onAttachment?: (stateOptions: Partial<GuardianOptions>, sequentialLayer: Array<SequentialLayer>) => void) {

    }

    public add(operations: (Array<LayerOperation> | LayerOperation)) {

        const operationsAsArray = Array.isArray(operations) ? operations : [operations] ;

        const {layerKey} = this.stateOptions;

        const sequentialLayers: Array<SequentialLayer> = operationsAsArray.map((op, i) => op({
            ...this.stateOptions,
            layerKey: `${this.stateOptions.layerKey}:${i}`
        }))

        this.definitionPool.set(`${layerKey}`, {
            options: this.stateOptions as GuardianOptions,
            sequences: sequentialLayers
        });

        this.layersStack.push(`${layerKey}`);
        // this.onAttachment(this.stateOptions, this.sequentialLayers);
    }

}