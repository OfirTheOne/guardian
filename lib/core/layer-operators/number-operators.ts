import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperator } from '../../models/layer-operator';



export const Gt: LayerOperator<[number]> = (num: number) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Gt',
            (o: any) => typeof o == 'number' && o > num,
            options
        );
}

export const Gte: LayerOperator<[number]> = (num: number) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Gte',
            (o: any) => typeof o == 'number' && o >= num,
            options
    );
}

export const Lt: LayerOperator<[number]> = (num: number) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Lt',
            (o: any) => typeof o == 'number' && o < num,
            options
    );
}

export const Lte: LayerOperator<[number]> = (num: number) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Lte',
            (o: any) => typeof o == 'number' && o <= num,
            options
    );
}

export const InRange: LayerOperator<[number, number]> = (a: number, b: number) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'InRange',
            (o: any) => typeof o == 'number' && a <= o && o <= b,
            options
    );
}