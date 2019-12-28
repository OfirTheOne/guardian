
import { GuardianLayer } from './../../models/guardian-layer'
import { GuardianBaseContext } from '../guardian-context-base';

export class CustomContext extends GuardianBaseContext {

    constructor(onAssignment: (layer: Partial<GuardianLayer>) => void) { 
        super(onAssignment)
    }

    static registeredCustomFunctions = new Map<string, (...arg: any[]) => boolean>();
    static registerCustomFunction(key: string, customFun: (...arg: any[]) => boolean) {
        this.registeredCustomFunctions.set(key, customFun);
    }


    run(key: string, ...args: any[]) {
        this.guardContextMethod(
            CustomContext.registeredCustomFunctions.get(key).bind({args}),//(o: any) => o != null,
            key
        )
        return this;
    }
}