
import { LayerOperator } from './../../models/layer-operator';
import { GuardianOptions } from './../../models/guardian-options';
import { SequentialLayer } from './../../models/sequential-layer';


export const Email : LayerOperator = (text: string) => {
    return (options: Partial<GuardianOptions>) => 
        new SequentialLayer(
            'Email', 
            (text: string) => typeof text == 'string' && /^ $/.test(text),
            options
        );


}


export const StrongPassword = (text: string) => {

}


export const Alpha = (text: string) => {

}


export const Numeric = (text: string) => {

}


export const AlphaNumeric = (text: string) => {

}