import { LayerOperator } from "./../../models/layer-operator";
import { LayerOperation } from "./../../models/layer-operation";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";


export const TypeString = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeString',
            (o: any) => typeof o == 'string',
         options
    );
}

export const TypeNumber = (): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeNumber',
            (o: any) => typeof o == 'number',
         options
    );
}

export const TypeBoolean = (): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeBoolean',
            (o: any) => typeof o == 'boolean',
         options
    );
}

export const TypeObject = (): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeObject',
            (o: any) => typeof o == 'object' && o !== null,
         options
    );
}

export const TypeArray = (): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeArray',
            (o: any) => Array.isArray(o),
         options
    );
}


