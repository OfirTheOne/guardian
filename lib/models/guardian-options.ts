export interface GuardianOptions {
    layerKey?: string | number;
    optional?: boolean;
    errorMessage?: string;
    each?: boolean;
    disabled?: boolean
    path: string | Array<string>;
}