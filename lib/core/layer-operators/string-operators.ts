import { LayerOperator } from "./../../models/layer-operator";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";
import { LayerOperation } from "../../models/layer-operation";


export const EndsWith = (text: string): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'EndsWith',
            (o: any) => typeof o == 'string' && o.endsWith(text),
         options
    );
}


export const StartWith = (text: string): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'StartWith',
            (o: any) => typeof o == 'string' && o.startsWith(text),
         options
    );
}


export const Contains = (text: string): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Contains',
            (o: any) => typeof o == 'string' && o.includes(text),
         options
    );
}

export const LengthOf = (len: number): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'LengthOf',
            (o: any) => typeof o == 'string' && o.length == len,
         options
    );
}

export const Match = (pattern: string | RegExp): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Match',
            (o: any) => typeof o == 'string' && new RegExp(pattern).test(o),
            options
    );
}

export const NotEmpty = (): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'NotEmpty',
            (o: any) => o != '',
            options
    );
}


