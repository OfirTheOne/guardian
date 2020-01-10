export class CustomFunctionNotFound extends Error {
    constructor(functionName: string) {
        super(`The costum function ${functionName} not found in the registry.`)
    }
}


export class LayerKeyNotFound extends Error {
    constructor(keys: Array<string>) {
        super(`The key(s) ${keys.join(', ')} not found.`)
    }
}