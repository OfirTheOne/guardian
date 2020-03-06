import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperator } from '../../models/layer-operator';
import { LayerOperation } from '../../models/layer-operation';



export const Gt = (num: number): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Gt',
            (o: any) => typeof o == 'number' && o > num,
            options
        );
}

export const Gte = (num: number): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Gte',
            (o: any) => typeof o == 'number' && o >= num,
            options
    );
}

export const Lt = (num: number): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Lt',
            (o: any) => typeof o == 'number' && o < num,
            options
    );
}

export const Lte = (num: number): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Lte',
            (o: any) => typeof o == 'number' && o <= num,
            options
    );
}

export const InRange = (a: number, b: number): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'InRange',
            (o: any) => typeof o == 'number' && a <= o && o <= b,
            options
    );
}

export const IsPositive: LayerOperator = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'IsPositive',
            (o: any) => typeof o == 'number' && o >= 0,
            options
    );
}

export const IsNegative: LayerOperator = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'IsNegative',
            (o: any) => typeof o == 'number' && o < 0,
            options
    );
}


export const IsInteger: LayerOperator = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'IsInteger',
            (o: any) => typeof o == 'number' && Number.isInteger(o),
            options
    );
}