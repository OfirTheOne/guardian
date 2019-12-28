
import { Guardian } from './../lib'
import { CustomContext } from './../lib/core/contexts'


CustomContext.registerCustomFunction(
    'start-with-X', 
    function(name: string) { 
        const prefix = this.args[0]; // dynamically bound context
        return name.startsWith(prefix);
    }
)


const guardian = new Guardian(); // instantiate an Guardian object to build the validation layers on top.


guardian.on({ 
    path: 'data.address', 
    errorMassage: 'address is required' 
}).        
existent.isNotNull()
        .isNotUndefined();


guardian.on({ 
    path: 'name',                 
    errorMassage: 'name must start with B' 
}).        
custom.run('start-with-X', 'B');


guardian.on({ 
    path: 'data.list[$]',         
    errorMassage: 'all items in list are required',
    each: true 
}). 
existent.isNotNull();


guardian.on({ 
    path: 'data.items[-1].num',   
    errorMassage: 'last item must be greater than 5', 
}).
number.gt(5);

guardian.compile({ 
    name: 'Bob', 
    data: { 
        address: 'home', 
        list: [2, null], 
        items: [
            {num: 2}, 
            {num: null}, 
            {num: 6}, 
            {num: 8}, 
            {num: 10}]
    } 
});

guardian.layersSummery()

guardian.run().then(errors => {
    console.log(errors);
});