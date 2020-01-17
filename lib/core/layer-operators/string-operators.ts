import { LayerOperator } from "./../../models/layer-operator";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";


export const Contains: LayerOperator<[string]> = (text: string) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Contains',
            (o: any) => typeof o == 'string' && o.includes(text),
         options
    );
}

export const Match: LayerOperator<[string | RegExp]> = (pattern: string | RegExp) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Match',
            (o: any) => typeof o == 'string' && new RegExp(pattern).test(o),
            options
    );
}

export const NotEmpty: LayerOperator = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'NotEmpty',
            (o: any) => o != '',
            options
    );
}