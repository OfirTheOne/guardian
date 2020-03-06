
import { GuardianOptions } from './../../models/guardian-options';
import { SequentialLayer } from './../../models/sequential-layer';
import { LayerOperation } from '../../models/layer-operation';


export const Email = (text: string): LayerOperation  => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Email', 
            (text: string) => typeof text == 'string' && /^ $/.test(text),
            options
        );


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