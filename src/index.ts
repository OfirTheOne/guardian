import { CustomRegistryContext } from '../lib/core/custom-registry';


CustomRegistryContext.registerCustomFunction(
    'start-with-X', 
    function(name: string) { 
        const prefix = this.args[0]; // dynamically bound context
        return name.startsWith(prefix);
    }
)



import { Guardian } from '../lib'

import { NotNull, NotUndefined, Gt, RunCustom } from '../lib/core/layer-operators';


// instantiate an Guardian object to build the validation layers on top.
const guardian = new Guardian(); 


// stacking up the layers

guardian.on({ 
    path: ['data.address', 'name'], 
    errorMessage: 'name & address are required' 
}).add([
    NotNull(), 
    NotUndefined()
]);


guardian.on({ 
    path: 'name', 
    errorMessage: 'name must start with B' 
}).add([
    RunCustom('start-with-X', 'B')
]);


guardian.on({ 
    path: 'data.list[$]',         
    errorMessage: 'all items in list are required',
    each: true 
}).add([
    NotNull()
]);


guardian.on({ 
    path: 'data.items[-1].num',   
    errorMessage: 'last item must be greater than 5', 
}).add([
    Gt(5)
]);


// compile the target object
guardian.compile({ 
    name: 'Bob', 
    data: { 
        address: null, 
        list: [2, null], 
        items: [
            {num: 2}, 
            {num: null}, 
            {num: 6}, 
            {num: 8}, 
            {num: 10}]
    } 
});




guardian.run().then(errors => {
    console.log(JSON.stringify(errors, undefined, 2));
});