// import { GuardianLayer } from './../../models/guardian-layer'
import { SequentialLayer } from '../../models/sequential-layer';
import { GuardianOptions } from '../../models/guardian-options';
import { LayerOperation } from '../../models/layer-operation';


import { isUniqueBy } from '../../inner/utilities';

/**
 * @description 
 * Pass validation if - value passed to (parameter) values.includes function and return true.  
 */
export const ValueIn = (...values: Array<any>): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ValueIn',
            (o: any) => values.includes(o),
            options
        );
    
}

/**
 * @description 
 * Pass validation if - value is an array & each item in the array passed to (parameter) values.includes function and return true.  
 */
export const EveryValueIn = (...values: Array<any>): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'EveryValueIn',
            (o: any) => Array.isArray(o) && o.every(v => values.includes(v)),
            options
        );
    
}

/**
 * @description 
 * Pass validation if - value is an array & at least one item in the array passed to (parameter) values.includes function and return true.  
 */
export const SomeValueIn = (...values: Array<any>): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'SomeValueIn',
            (o: any) => Array.isArray(o) && o.some(v => values.includes(v)),
            options
        );
    
}


/**
 * @description 
 * Pass validation if - value is an array & value length larger then 0.  
 */
export const ArrayNotEmpty = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ArrayNotEmpty',
            (o: any) => Array.isArray(o) && o.length > 0,
            options
        );
    
}


/**
 * @description 
 * Pass validation if - value is an array & value length equals to 0.  
 */
export const ArrayEmpty = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ArrayEmpty',
            (o: any) => Array.isArray(o) && o.length == 0,
            options
        );
    
}


/**
 * @description 
 * Pass validation if - value is an array & value length equals to len.  
 */
export const ArrayLengthOf = (len: number): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ArrayLengthOf',
            (o: any) => Array.isArray(o) && o.length == len,
            options
        );
    
}

/**
 * @description 
 * Pass validation if - value is an array & contains only unique values. 
 * the array reduces to set of key-value, where item is the key and the value, if an item found in the set as a key, the array define as not unique.  
 */
export const Unique = (): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Unique',
            (o: any) => Array.isArray(o) && isUniqueBy(o),
            options
        );
    
}

/**
 * @description 
 * Pass validation if - value is an array & contains only unique values. 
 * the array reduces to set of key-value, where keyMap(item) is the key and the value, if a keyMap(item) found in the set as a key, the array define as not unique.  
 */
export const UniqueBy = (keyMap: Function): LayerOperation => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'ArrayLengthOf',
            (o: any) => Array.isArray(o) && isUniqueBy(o, keyMap),
            options
        );
    
}
