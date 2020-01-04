export class CustomFunctionNotFound extends Error {
    constructor(functionName: string) {
        super(`The costum function ${functionName} not found in the registry.`)
    }
}