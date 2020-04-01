export type OnErrorAction = ((input: {target: any, name: string, root: any})=>(Promise<any>|any));
export type OnResolveAction = ((input: {target: any, name: string, root: any})=>(Promise<any>|any));
