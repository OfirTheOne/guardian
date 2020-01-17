import { LayerOperator } from "./../../models/layer-operator";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";


export const TypeString: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeString',
            (o: any) => typeof o == 'string',
         options
    );
}

export const TypeNumber: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeNumber',
            (o: any) => typeof o == 'number',
         options
    );
}

export const TypeBoolean: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeBoolean',
            (o: any) => typeof o == 'boolean',
         options
    );
}

export const TypeObject: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeObject',
            (o: any) => typeof o == 'object',
         options
    );
}

export const TypeArray: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'TypeArray',
            (o: any) => Array.isArray(o),
         options
    );
}


