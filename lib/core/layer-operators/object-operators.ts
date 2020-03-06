import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";
import { LayerOperation } from "../../models/layer-operation";




export const ContainsEveryKeys = (keys: Array<string>): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ContainsKeys',
            (o: any) => typeof o == 'object' && keys.every(k => Object.keys(o).includes(k)),
         options
    );
}

export const ContainsSomeKeys = (keys: Array<string>): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ContainsKeys',
            (o: any) => typeof o == 'object' && keys.some(k => Object.keys(o).includes(k)),
         options
    );
}

export const ContainsKeys = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ContainsAnyKeys',
            (o: any) => typeof o == 'object' && Object.keys(o).length > 0,
         options
    );
}
