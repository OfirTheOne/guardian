import { LayerOperator } from "./../../models/layer-operator";
import { LayerOperation } from "./../../models/layer-operation";
import { GuardianOptions } from "./../../models/guardian-options";
import { SequentialLayer } from "./../../models/sequential-layer";
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';


export const TypeString = (): LayerOperation => {
    return new LayerOperation(
            (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
            new SequentialLayer(
                'TypeString',
                (o: any) => typeof o == 'string',
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const TypeNumber = (): LayerOperation  => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
            new SequentialLayer(
                'TypeNumber',
                (o: any) => typeof o == 'number',
                options,
                onErrorActions,
                onResolveActions,
            )
    );
}

export const TypeBoolean = (): LayerOperation  => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
            new SequentialLayer(
                'TypeBoolean',
                (o: any) => typeof o == 'boolean',
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const TypeObject = (): LayerOperation  => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
            new SequentialLayer(
                'TypeObject',
                (o: any) => typeof o == 'object' && o !== null,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}

export const TypeArray = (): LayerOperation  => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
            new SequentialLayer(
                'TypeArray',
                (o: any) => Array.isArray(o),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
}


