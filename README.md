


# Guardian

## Validation Module - Follow the Builder pattern.   

* provide an easy validation layers building api.
* support sync & async validation as one.
* provide a custom (sync & async) validation method registry, for global app usage. 
* support a reduction of a validation stack to an express/connect middleware.
* support typescript from the box.
* provide OR relation in the validation stack.
* no dependencies.

<br>
<br>

## Example 


```ts
// validation-registry.ts

import { CustomRegistryContext } from 'guardian/core/custom-registry';


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
    "message": "name & address are required",
    "target": null,
    "path": "data.address",
    "layerKey": 1
  },
  {
    "message": "all items in list are required",
    "target": [
      2,
      null
    ],
    "path": "data.list[$]",
    "layerKey": 3
  }
]

```

<br>

### Stack Summary

```ts
guardian.stackSummary()

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

<br>
<br>
<br>
<br>

## API 

### `class Guardian` <br>

By using a Guardian object a stack of validation layers can be built to validate a single object target.

```ts
const guardian = new Guardian()
```
<br>
<br>

### Method

#### `guardian.on()`
```ts
on(options: GuardianOptions): LayerAttacher;
on(path: Array<string>): LayerAttacher;
on(path: string): LayerAttacher;
```

A factory method for LayerAttacher object, with `on` method you're setting the configuration for the validation layer you're about to create.  

[GuardianOptions reference](####GuardianOptions)

* Example : 
```ts
guardian.on({ 
    path: 'data.list[$]',         
    errorMessage: 'all items in list are required',
    each: true 
}).add([
    NotNull()
]);

```

<br>
<br>

#### `guardian.orReduction()`
```ts
orReduction(...keys: Array<string>): void
```

By providing the layers keys, `orReduction` will reduce the referenced layers to a single layer, that resolve to true if at least on of the referenced layers resolved to true.

* Example :
```ts

const guardian = new Guardian();

guardian.on({ 
    path: 'name', 
    errorMessage: 'name must start with B.' 
}).add([
    RunCustom('start-with-X', 'B')
]);

guardian.on({ 
    path: 'data.age',         
    errorMessage: 'age is required & must be greater than 20.'
}).add([
    NotNull(),
    Gt(20)
]);

guardian.on({ 
    path: 'data.list[$]',         
    errorMessage: 'all items in list are required',
    each: true 
}).add([
    NotNull()
]);

// before orReduction --> 1 & 2 & 3

guardian.orReduction('1', '3');

// after orReduction --> (1 || 3) & 2

guardian.compile({ 
    name: 'Bob', 
    data: { 
        age: 25,
        list: [2, null]
    }
});

console.log('summary:');
guardian.stackSummary();

guardian.run().then(errors => {
    console.log('result:');
    console.log(JSON.stringify(errors, undefined, 2));
});

// Output :
```
```sh
summary:
┌─────────┬────────┬─────────────────────┬────────────────┬─────┐
│ (index) │ Layer  │        Name         │      Path      │ Key │
├─────────┼────────┼─────────────────────┼────────────────┼─────┤
│    0    │ 'OR/1' │ [ 'start-with-X' ]  │     'name'     │  1  │
│    1    │ 'OR/1' │    [ 'NotNull' ]    │ 'data.list[$]' │  3  │
│    2    │   1    │ [ 'NotNull', 'Gt' ] │   'data.age'   │  2  │
└─────────┴────────┴─────────────────────┴────────────────┴─────┘
result:
[]
```

<br>
<br>

#### `guardian.compile()`
```ts
compile(target: any): void
```

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

<br>
<br>

#### `guardian.run()`
```ts
run(): Promise<Array<any>
```

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

<br>
<br>

#### `guardian.disable()`
```ts
disable(layerKey: number|string): void
```

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

<br>
<br>

#### `guardian.stackSummary()`
```ts
stackSummary(prettyPrint: boolean): void 
stackSummary(): Array<any> 
```

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

<br>
<br>

#### `guardian.toMiddleware()`
```ts
toMiddleware(target?: Function ): e.RequestHandler
toMiddleware(target?: string ): e.RequestHandler
```

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

* Example : 
```ts
const guardian = new Guardian();

guardian.on({ 
    path: 'email', 
    errorMessage: 'email field in requierd.'
}).add([
    NotUndefined(),
    NotNull(),
    NotEmpty()
])

// the root object will be {req, res}
const logisterValidator = guardian.toMiddleware('req.body');

const app = express();
app.post('/login', logisterValidator, (req, res, next) => {
    // request pass all validations ...
});
```

<br>
<br>

### Interfaces

#### `GuardianOptions`
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

```ts
interface GuardianOptions {
    layerKey?: string | number;
    optional?: boolean;
    errorMessage?: string;
    each?: boolean;
    disabled?: boolean
    path: string | Array<string>;
}
```

<br>
<br>
<br>
<br>

### `class LayerAttacher`
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

```ts
const layerAttcher = guardian.on(...);
```

<br>
<br>

### Method

#### `layerAttcher.add()`
```ts
add(operations: LayerOperation): void
add(operations: Array<LayerOperation>): void
```

define a single validation layer with one or more layer-operations. where each operation holds the actual validation logic.

[LayerOperation reference](####LayerOperation)


<br>
<br>

### Interfaces

#### `LayerOperation`
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took.

```ts
interface LayerOperation {
    (optionas: Partial<GuardianOptions>): SequentialLayer
}
```


