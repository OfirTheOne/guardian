import { GuardianOptions } from "./guardian-options";
import { LayerOperation } from './layer-operation';
import { OnErrorAction, OnResolveAction } from './operation-hooks';

export class SequentialLayer {

    constructor(
        public name: string, 
        public action: Function,
        public options: Partial<GuardianOptions>,
        public onErrorActions: Array<OnErrorAction> = [],
        public onResolveActions: Array<OnResolveAction> = []
        ) 
    {  }

}