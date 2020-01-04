import { GuardianOptions } from "./guardian-options";

export class SequentialLayer {

    constructor(
        public name: string, 
        public action: Function,
        public options: Partial<GuardianOptions>
        // private onAssignment: (layer: Partial<GuardianLayer>) => void
        ) 
    {  }

}