// import { GuardianLayer } from './../../models/guardian-layer'
import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperation } from '../../models/layer-operation';



export const NotUndefined = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'NotUndefined',
            (o: any) => o != undefined,
            options
        );
    
}

export const NotNull = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'NotNull',
            (o: any) => o != null,
            options
        );
    
}
