import {GuardianOptions} from './guardian-options';
export interface GuardianLayer extends GuardianOptions {


    guardFunction: Function;
    name: string;

}