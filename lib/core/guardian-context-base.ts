
import { GuardianLayer } from "../models/guardian-layer";

export class GuardianBaseContext {

    protected disposed: boolean = false;

    constructor(protected onAssignment: (layer: Partial<GuardianLayer>) => void) { }
    

    protected guardContextMethod(guardFunction: Function, name: string) {
        // if(this.disposed) throw Error('Context is disposed');

        this.onAssignment({
            guardFunction,
            name
        })

        // this.disposed = true;
    }

}
