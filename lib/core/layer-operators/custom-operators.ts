

import { CustomRegistryContext } from '../custom-registry';
import { CustomFunctionNotFound } from './../../errors';

import { GuardianOptions } from './../../models/guardian-options';
import { SequentialLayer } from './../../models/sequential-layer';
import { LayerOperation } from '../../models/layer-operation';
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';


export const RunCustom = (key: string, ...args: any[]): LayerOperation => {
    if(!CustomRegistryContext.registeredCustomFunctions.has(key)) {
        throw new CustomFunctionNotFound(key)
    }
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
            new SequentialLayer(
                key,
                CustomRegistryContext.registeredCustomFunctions.get(key).bind({args}),//(o: any) => o != null,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}
