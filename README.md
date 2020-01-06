


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

import { CustomContext } from 'guardian/core/custom-registry';


CustomRegistryContext.registerCustomFunction(
    'start-with-X', 
    function(name: string) { 
        const prefix = this.args[0]; // dynamically bound context
        return name.startsWith(prefix);
    }
)

```

```ts

import { Guardian } from 'guardian'

import { NotNull, NotUndefined, Gt, RunCustom } from 'guardian/core/layer-operators';


// instantiate an Guardian object to build the validation layers on top.
const guardian = new Guardian(); 


// stacking up the layers

guardian.on({ 
    path: ['data.address', 'name'], 
    errorMessage: 'address is required' 
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

[
  {
    "massege": "address is required",
    "target": null,
    "path": [
      "data.address",
      "name"
    ],
    "layerKey": 1
  },
  {
    "massege": "all items in list are required",
    "target": [
      2,
      null
    ],
    "path": [
      "data.list[$]"
    ],
    "layerKey": 3
  }
]

```

<br>

### Layers Summery

```ts
guardian.layersSummery()

// Output : 

```

```sh

┌─────────┬───────┬───────────────────────────────┬────────────────────────────┬─────┐
│ (index) │ Layer │             Name              │            Path            │ Key │
├─────────┼───────┼───────────────────────────────┼────────────────────────────┼─────┤
│    0    │   1   │ [ 'NotNull', 'NotUndefined' ] │ [ 'data.address', 'name' ] │  1  │
│    1    │   2   │      [ 'start-with-X' ]       │           'name'           │  2  │
│    2    │   3   │         [ 'NotNull' ]         │       'data.list[$]'       │  3  │
│    3    │   4   │           [ 'Gt' ]            │    'data.items[-1].num'    │  4  │
└─────────┴───────┴───────────────────────────────┴────────────────────────────┴─────┘

```


