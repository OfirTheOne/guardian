import { SequentialLayer } from "./sequential-layer";
import { GuardianOptions } from "./guardian-options";
import { OnErrorAction, OnResolveAction } from './operation-hooks';

// export type LayerOperation = (optionas: Partial<GuardianOptions>) => SequentialLayer;
export interface LayerCoreOperation {
    (
        options: Partial<GuardianOptions>,
        onErrorActions: Array<OnErrorAction>,
        onResolveActions: Array<OnResolveAction>
    ): SequentialLayer
}


export class LayerOperation {
    onErrorActions: Array<OnErrorAction> = [];
    onResolveActions: Array<OnResolveAction> = [];
    
    constructor(public coreOperation: LayerCoreOperation) {}

    onResolve(action: OnResolveAction) {
        this.onResolveActions.push(action)
        return this;
    }
    onError(action: OnErrorAction) {
        this.onErrorActions.push(action)
        return this;
    }
}

