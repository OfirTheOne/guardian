
import { GuardianLayer } from './../models/guardian-layer'



export class GuardianContext {

    
    constructor(private onAssignment: (layer: Partial<GuardianLayer>) => void) {}



}



