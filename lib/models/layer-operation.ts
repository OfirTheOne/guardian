import { SequentialLayer } from "./sequential-layer";
import { GuardianOptions } from "./guardian-options";

export type LayerOperation = (optionas: Partial<GuardianOptions>) => SequentialLayer;