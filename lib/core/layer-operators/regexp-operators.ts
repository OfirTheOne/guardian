
import { GuardianOptions } from './../../models/guardian-options';
import { SequentialLayer } from './../../models/sequential-layer';
import { LayerOperation } from '../../models/layer-operation';
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';


export const Email = (text: string): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) =>
            new SequentialLayer(
                'Email',
                (text: string) => typeof text == 'string' && /^ $/.test(text),
                options,
                onErrorActions,
                onResolveActions,
            )
    )


}

/*
export const StrongPassword = (text: string): LayerOperation  => {

}


export const Alpha = (text: string): LayerOperation  => {

}


export const Numeric = (text: string): LayerOperation  => {

}


export const AlphaNumeric = (text: string): LayerOperation  => {

}
*/