import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperator } from '../../models/layer-operator';
import { LayerOperation } from '../../models/layer-operation';
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';



export const Gt = (num: number): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Gt',
                (o: any) => typeof o == 'number' && o > num,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const Gte = (num: number): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Gte',
                (o: any) => typeof o == 'number' && o >= num,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const Lt = (num: number): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Lt',
                (o: any) => typeof o == 'number' && o < num,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const Lte = (num: number): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Lte',
                (o: any) => typeof o == 'number' && o <= num,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const InRange = (a: number, b: number): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'InRange',
                (o: any) => typeof o == 'number' && a <= o && o <= b,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const IsPositive: LayerOperator = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'IsPositive',
                (o: any) => typeof o == 'number' && o >= 0,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const IsNegative: LayerOperator = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'IsNegative',
                (o: any) => typeof o == 'number' && o < 0,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}


export const IsInteger: LayerOperator = (): LayerOperation => {
    return new LayerOperation(
        (
            options: Partial<GuardianOptions>,
            onErrorActions: Array<OnErrorAction>,
            onResolveActions: Array<OnResolveAction>
        ) =>
            new SequentialLayer(
                'IsInteger',
                (o: any) => typeof o == 'number' && Number.isInteger(o),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}