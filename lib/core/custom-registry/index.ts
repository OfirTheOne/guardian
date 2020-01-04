export class CustomRegistryContext  {

    static registeredCustomFunctions = new Map<string, (...arg: any[]) => boolean>();
    static registerCustomFunction(key: string, customFun: (...arg: any[]) => boolean) {
        this.registeredCustomFunctions.set(key, customFun);
    }

}
