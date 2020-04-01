// import { GuardianLayer } from './../../models/guardian-layer'
import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperation } from '../../models/layer-operation';
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';



export const NotUndefined = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'NotUndefined',
                (o: any) => o != undefined,
                options,
                onErrorActions,
                onResolveActions,
            )
    )

}

export const NotNull = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'NotNull',
                (o: any) => o != null,
                options,
                onErrorActions,
                onResolveActions,
            )
    )

}
