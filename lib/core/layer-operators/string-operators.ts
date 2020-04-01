import { LayerOperator } from "./../../models/layer-operator";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";
import { LayerOperation } from "../../models/layer-operation";
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';


export const EndsWith = (text: string): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'EndsWith',
                (o: any) => typeof o == 'string' && o.endsWith(text),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}


export const StartWith = (text: string): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'StartWith',
                (o: any) => typeof o == 'string' && o.startsWith(text),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}


export const Contains = (text: string): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Contains',
                (o: any) => typeof o == 'string' && o.includes(text),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const LengthOf = (len: number): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'LengthOf',
                (o: any) => typeof o == 'string' && o.length == len,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const Match = (pattern: string | RegExp): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Match',
                (o: any) => typeof o == 'string' && new RegExp(pattern).test(o),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const NotEmpty = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'NotEmpty',
                (o: any) => o != '',
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}


