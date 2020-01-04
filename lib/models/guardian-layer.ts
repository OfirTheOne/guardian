import {GuardianOptions} from './guardian-options';
export interface GuardianLayer extends GuardianOptions {


    guardAction: Function;
    name: string;

}