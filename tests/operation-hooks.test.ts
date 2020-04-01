


import { expect } from 'chai';

import { Guardian } from './../lib'
import { NotNull, NotUndefined } from './../lib/core/layer-operators';




describe('Operation Hooks', function() {


    it('Using multi path', function(done) {
        let valuesToSyncOnHookExecution = {
            notNullResolveHook: [],
            notUndefinedResolveHook: [],            
            notNullErrorHook: [],
            notUndefinedErrorHook: [],
        }

        const targetObject = { 
            name: 'Bob', 
            data: { 
                address: null, 
            }
        }

        const guardian = new Guardian();
        
        guardian.on({ 
            path: ['data.address', 'name'], 
            errorMessage: 'name & address required'
        }).add([
            NotNull()
                .onResolve(({target}) => valuesToSyncOnHookExecution.notNullResolveHook.push(target))
                .onError(({target}) => valuesToSyncOnHookExecution.notNullErrorHook.push(target)), 
            NotUndefined()
                .onResolve(({target}) => valuesToSyncOnHookExecution.notUndefinedResolveHook.push(target))
                .onError(({target}) => valuesToSyncOnHookExecution.notUndefinedErrorHook.push(target)), 
        ]);
                
        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(1)
                expect(errors[0].path).to.be.equal('data.address')
                expect(valuesToSyncOnHookExecution.notNullErrorHook[0]).eq(null)
                expect(valuesToSyncOnHookExecution.notNullResolveHook.length).eq(0)
                expect(valuesToSyncOnHookExecution.notUndefinedErrorHook.length).eq(0)
                expect(valuesToSyncOnHookExecution.notUndefinedResolveHook.length).eq(0)
                done()
            })
            .catch(e => done(e));

    });

    
    it('Using "each" option on a nested array', function(done) {
        let valuesToSyncOnHookExecution = {
            notNullResolveHook: [],
            notNullErrorHook: [],
        }
       const targetObject = { 
            name: 'Bob', 
            items: [
                {num: 2}, 
                {num: 4}, 
                {num: 6}, 
                {num: 8}, 
                {num: 10}
            ]
        }

        const guardian = new Guardian();
        
        guardian.on({ 
            path: 'items[$].num',         
            errorMessage: 'all items in items list are required',
            each: true 
        }).add([
            NotNull()                
                .onResolve(({target}) => valuesToSyncOnHookExecution.notNullResolveHook.push(target))
                .onError(({target}) => valuesToSyncOnHookExecution.notNullErrorHook.push(target)), 
        ]);

        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(0)
                expect(valuesToSyncOnHookExecution.notNullResolveHook[0]).deep.equal(targetObject.items.map(t => t.num))
                expect(valuesToSyncOnHookExecution.notNullErrorHook.length).eq(0)
                done()
            })
            .catch(e => done(e));
    });

    it('Using "each" option on a nested array', function(done) {
        let valuesToSyncOnHookExecution = {
            notNullResolveHook: [],
            notNullErrorHook: [],
        }
       const targetObject = { 
            name: 'Bob', 
            items: [
                {num: 2}, 
                {num: 4}, 
                {num: 6}, 
                {num: 8}, 
                {num: 10}
            ]
        }

        const guardian = new Guardian();
        
        guardian.on({ 
            path: 'items[$].num',         
            errorMessage: 'all items in items list are required',
            each: true 
        }).add([
            NotNull()                
                .onResolve(({target, root}) => valuesToSyncOnHookExecution.notNullResolveHook.push({target, root}))
                .onError(({target, root}) => valuesToSyncOnHookExecution.notNullErrorHook.push({target, root})), 
        ]);

        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(0)
                expect(valuesToSyncOnHookExecution.notNullResolveHook[0].target).deep.equal(targetObject.items.map(t => t.num))
                expect(valuesToSyncOnHookExecution.notNullResolveHook[0].root).equal(targetObject)
                expect(valuesToSyncOnHookExecution.notNullErrorHook.length).eq(0)
                done()
            })
            .catch(e => done(e));
    });
})


