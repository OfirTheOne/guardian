

# Guardian

## Validation Module - Follow the Builder pattern.   

* provide an easy validation layers building api.
* support sync & async validation as one.
* provide a custom (sync & async) validation method registry, for global app usage. 
* support a reduction of a validation stack to an express/connect middleware.
* support typescript from the box.
* no dependencies.

<br>

## Example 


```ts
// validation-registry.ts

import { CustomContext } from 'guardian/core/contexts'


CustomContext.registerCustomFunction(
    'start-with-X', 
    function(name: string) { 
        const prefix = this.args[0]; // dynamically bound context
        return name.startsWith(prefix);
    }
)
```

```ts

// instantiate an Guardian object to build the validation layers on top.
const guardian = new Guardian(); 


// stacking up the layers
guardian.on({ 
    path: 'data.address', 
    errorMessage: 'address is required' 
}).        
existent.isNotNull()
        .isNotUndefined();

guardian.on({ 
    path: 'name',                 
    errorMessage: 'name must start with B' 
}).        
custom.run('start-with-X', 'B');

guardian.on({ 
    path: 'data.list[$]',         
    errorMessage: 'all items in list are required',
    each: true 
}). 
existent.isNotNull();

guardian.on({ 
    path: 'data.items[-1].num',   
    errorMessage: 'last item must be greater than 5', 
}).
number.gt(5);

// compile the target object
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

// exec the validations
guardian.run().then(errors => {
    console.log(errors);
});

// Output : 

```


```sh

[ Error: all items in list are required
      at Guardian.<anonymous>
      ...
      ...
]

```

<br>

### Layers Summery

```ts
guardian.layersSummery()

// Output : 

```

```sh

┌─────────┬───────┬──────────────────┬──────────────────────┐
│ (index) │ Layer │       Name       │         Path         │
├─────────┼───────┼──────────────────┼──────────────────────┤
│    0    │   1   │   'isNotNull'    │    'data.address'    │
│    1    │   2   │ 'isNotUndefined' │    'data.address'    │
│    2    │   3   │  'start-with-X'  │        'name'        │
│    3    │   4   │   'isNotNull'    │    'data.list[$]'    │
│    4    │   5   │       'gt'       │ 'data.items[-1].num' │
└─────────┴───────┴──────────────────┴──────────────────────┘

```


