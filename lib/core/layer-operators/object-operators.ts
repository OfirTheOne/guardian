import { LayerOperator } from "./../../models/layer-operator";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";




export const ContainsEveryKeys: LayerOperator<[Array<string>]> = (keys: Array<string>) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ContainsKeys',
            (o: any) => typeof o == 'object' && keys.every(k => Object.keys(o).includes(k)),
         options
    );
}

export const ContainsSomeKeys: LayerOperator<[Array<string>]> = (keys: Array<string>) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ContainsKeys',
            (o: any) => typeof o == 'object' && keys.some(k => Object.keys(o).includes(k)),
         options
    );
}

export const ContainsKeys: LayerOperator<[Array<string>]> = () => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ContainsAnyKeys',
            (o: any) => typeof o == 'object' && Object.keys(o).length > 0,
         options
    );
}
