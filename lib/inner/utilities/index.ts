export function isUniqueBy(array: Array<any>, keyMap: Function = (item => item)) {
    const set: any = {};
    for(let item of array) {
        const key = keyMap(item);
        if(key in set) {
            return false;
        } else {
            set[key]=item;
        }
    }
    return true;
}