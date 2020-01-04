import { LayerOperation } from "./layer-operation";

export type LayerOperator<T extends Array<any> = any[]> = (...args: T) => LayerOperation