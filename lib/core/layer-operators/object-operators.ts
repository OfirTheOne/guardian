import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";
import { LayerOperation } from "../../models/layer-operation";
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';




export const ContainsEveryKeys = (keys: Array<string>): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'ContainsKeys',
                (o: any) => typeof o == 'object' && keys.every(k => Object.keys(o).includes(k)),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const ContainsSomeKeys = (keys: Array<string>): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'ContainsKeys',
                (o: any) => typeof o == 'object' && keys.some(k => Object.keys(o).includes(k)),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const ContainsKeys = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'ContainsAnyKeys',
                (o: any) => typeof o == 'object' && Object.keys(o).length > 0,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}
