import { GuardianLayer } from './../../models/guardian-layer'
import { GuardianBaseContext } from '../guardian-context-base';

export class ExistentsContext extends GuardianBaseContext {

    constructor(onAssignment: (layer: Partial<GuardianLayer>) => void) { 
        super(onAssignment)
    }

    isNotNull() {
        this.guardContextMethod(
            (o: any) => o != null,
            'isNotNull'
        )
        return this;
    }

    isNotUndefined() {
        this.guardContextMethod(
            (o: any) => o != undefined,
            'isNotUndefined'
        );
        return this;
    }


}