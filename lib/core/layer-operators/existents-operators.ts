// import { GuardianLayer } from './../../models/guardian-layer'
import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperator } from '../../models/layer-operator';



export const NotUndefined: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'NotUndefined',
            (o: any) => o != undefined,
            options
        );
    
}

export const NotNull: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'NotNull',
            (o: any) => o != null,
            options
        );
    
}
