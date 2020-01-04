

import { CustomRegistryContext } from '../custom-registry';
import { CustomFunctionNotFound } from './../../errors';

import { LayerOperator } from './../../models/layer-operator';
import { GuardianOptions } from './../../models/guardian-options';
import { SequentialLayer } from './../../models/sequential-layer';


export const RunCustom: LayerOperator<[string, ...any[]]> = (key: string, ...args: any[]) => {
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
