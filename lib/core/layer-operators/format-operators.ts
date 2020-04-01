// import { GuardianLayer } from './../../models/guardian-layer'
import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperation } from '../../models/layer-operation';
import { OnErrorAction, OnResolveAction } from '../../models/operation-hooks';




/**
 * @description 
 * Pass validation if - value is a string passed to Date.parse function and return a value not equal to NaN  
 */
export const DateFormat = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
        new SequentialLayer(
            'DateFormat',
            (o: any) => typeof o == 'string' && Date.parse(o) != NaN,
                options,
                onErrorActions,
                onResolveActions,
            )
    )
    
}

/**
 * @description 
 * Pass validation if - value is a string passed to JSON.parse function and do not raise an error
 */
export const JSONFormat = (): LayerOperation => {
    return new LayerOperation(
        (options: Partial<GuardianOptions>, onErrorActions: OnErrorAction[], onResolveActions: OnResolveAction[]) => 
        new SequentialLayer(
            'JSONFormat',
            (o: any) => 
                typeof o == 'string' && 
                (()=> {try { JSON.parse(o); return true;} catch(e) {return false;}})(),
                options,
                onErrorActions,
                onResolveActions,
            )
    )
    
}