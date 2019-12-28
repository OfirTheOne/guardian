

import { GuardianLayer } from './../models/guardian-layer'
import { ExistentsContext } from './contexts/existents-context'
import { StringContext } from './contexts/string-context'
import { NumberContext } from './contexts/number-context'
import { CustomContext } from './contexts/custom-context'


export class GuardianLegion {


    constructor(private onAssignment: (layer: Partial<GuardianLayer>) => void) {}


    get existent(): ExistentsContext {
        return new ExistentsContext(this.onAssignment)
    }

    get string(): StringContext {
        return new StringContext(this.onAssignment)
    }

    get number(): NumberContext {
        return new NumberContext(this.onAssignment)
    }    
    
    get custom(): CustomContext {
        return new CustomContext(this.onAssignment)
    }
        
    
}