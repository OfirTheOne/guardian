

import { CustomRegistryContext } from '../custom-registry';
import { CustomFunctionNotFound } from './../../errors';

import { GuardianOptions } from './../../models/guardian-options';
import { SequentialLayer } from './../../models/sequential-layer';
import { LayerOperation } from '../../models/layer-operation';


export const RunCustom = (key: string, ...args: any[]): LayerOperation => {
    if(!CustomRegistryContext.registeredCustomFunctions.has(key)) {
        throw new CustomFunctionNotFound(key)
    }
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            key,
            CustomRegistryContext.registeredCustomFunctions.get(key).bind({args}),//(o: any) => o != null,
            options
        )
}
