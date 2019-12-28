import { GuardianLayer } from "../../models/guardian-layer";
import { GuardianBaseContext } from "../guardian-context-base";

export class NumberContext extends GuardianBaseContext {

    constructor(onAssignment: (layer: Partial<GuardianLayer>) => void) { 
        super(onAssignment)
    }

    gt(num: number) {
        this.guardContextMethod(
            (o: any) => typeof o == 'number' && o > num,
            'gt'
        );
        return this;
    }

    gte(num: number) {
        this.guardContextMethod(
            (o: any) => typeof o == 'number' && o >= num,
            'gte'
        );
        return this;
    }

    lt(num: number) {
        this.guardContextMethod(
            (o: any) => typeof o == 'number' && o < num,
            'lt'
        );
        return this;
    }

    lte(num: number) {
        this.guardContextMethod(
            (o: any) => typeof o == 'number' && o <= num,
            'lte'
        );
        return this;
    }

    inRange(a: number, b: number) {
        this.guardContextMethod(
            (o: any) => typeof o == 'number' 
                && a <= o && o <= b,
            'inRange'
        );
        return this;
    }

}