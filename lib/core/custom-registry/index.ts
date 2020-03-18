export class CustomRegistryContext  {

    static registeredCustomFunctions = new Map<string, ((...arg: any[]) => (boolean|Promise<boolean>))>();
    static registerCustomFunction(key: string, customFun: (...arg: any[]) => (boolean|Promise<boolean>)) {
        this.registeredCustomFunctions.set(key, customFun);
    }

}
