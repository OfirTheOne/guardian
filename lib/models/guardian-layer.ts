import {GuardianOptions} from './guardian-options';
import { SequentialLayer } from './sequential-layer';
// export interface GuardianLayer extends GuardianOptions {


//     guardAction: Function;
//     name: string;

// }

export interface GuardianLayer {

    options: GuardianOptions;

    sequences: Array<SequentialLayer>

}