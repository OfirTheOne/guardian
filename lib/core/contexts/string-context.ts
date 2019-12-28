import { GuardianLayer } from "../../models/guardian-layer";
import { GuardianBaseContext } from "../guardian-context-base";

export class StringContext extends GuardianBaseContext {

    constructor(onAssignment: (layer: Partial<GuardianLayer>) => void) { 
        super(onAssignment)
    }

    contains(text: string) {
        this.guardContextMethod(
            (o: any) => typeof o == 'string' && o.includes(text),
            'contains'
        );
        return this;
    }

    match(pattern: string | RegExp) {
        this.guardContextMethod(
            (o: any) => typeof o == 'string' && o.match(pattern).length,
            'match'
        );
        return this;
    }

    isNotEmpty() {
        this.guardContextMethod(
            (o: any) => o != '',
            'isNotUndefined'
        );
        return this;
    }
}