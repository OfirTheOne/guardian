


import { expect } from 'chai';

import { Guardian, CustomRegistryContext } from './../lib'
import { TypeString, RunCustom } from './../lib';



const doAfter = (syncAction: Function, ms: number) => new Promise<any>((resolve, reject) => 
    setTimeout(
        () => { try { resolve(syncAction()) } catch(error) { reject(error); } } , 
        ms 
    )
)

describe('Custom Async Operation', function() {


    it('Run custom async operation', function(done) {

        CustomRegistryContext.registerCustomFunction('some-async-func', 
            async function (target) {
                await doAfter(() => {
                    const extraArg = this.args[0];
                    expect(target).to.be.eq(targetObject.name) 
                    expect(extraArg).to.be.eq(extraTarget) 
                }, 200);
                return true;
            }
        )

        const extraTarget = 20;
        const targetObject = { 
            name: 'Bob', 
            data: { 
                address: null, 
            }
        }

        const guardian = new Guardian();
        
        guardian.on({ 
            path: ['data.address', 'name'], 
            errorMessage: 'name & address are invalid',
            optional: true
        }).add([
            TypeString(),
        ]);

        guardian.on({ 
            path: 'name', 
            errorMessage: 'async validation on name field',
            optional: true
        }).add([
            TypeString(),
            RunCustom('some-async-func',  extraTarget)
        ]);
        
        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(0)
                done()
            })
            .catch(e => done(e));

    });
/*
    it('Throws an error - Optional with multi path', function(done) {
        const targetObject = { 
            name: 'Bob', 
            data: { 
                address: null, 
            }
        }

        const guardian = new Guardian();
        
        guardian.on({ 
            path: ['data.address', 'name'], 
            errorMessage: 'name & address are invalid',
            optional: true
        }).add([
            TypeNumber(), 
        ]);
                
        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(1);
                expect(errors[0].path).to.be.equal('name')

                done()
            })
            .catch(e => done(e));

    });
*/
})


