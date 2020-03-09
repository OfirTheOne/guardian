


import { expect } from 'chai';

import { Guardian } from './../lib'
import { NotNull, NotUndefined, TypeString, TypeNumber } from './../lib/core/layer-operators';




describe('Optional', function() {


    it('Optional with multi path', function(done) {
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
                
        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(0)
                done()
            })
            .catch(e => done(e));

    });

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
   
    it('Optional with "each" option on a nested array', function(done) {

       const targetObject = { 
            name: 'Bob', 
            items: [
                {num: 2}, 
                {num: null}, 
                {num: 6}, 
                {num: 8}, 
                {num: 10}
            ]
        }

        const guardian = new Guardian();
        
        guardian.on({ 
            path: 'items[$].num',         
            errorMessage: 'all items must be of type number',
            each: true ,
            optional: true
        }).add([
            TypeNumber()
        ]);

        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(0)
                done()
            })
            .catch(e => done(e));
    });
    
    it('Throws an error - Optional with "each" option on a nested array', function(done) {

        const targetObject = { 
             name: 'Bob', 
             items: [
                 {num: 2}, 
                 {num: null}, 
                 {num: 6}, 
                 {num: {
                     value : 10
                 }}, 
                 {num: 10}
             ]
         }
 
         const guardian = new Guardian();
         
         guardian.on({ 
             path: 'items[$].num',         
             errorMessage: 'all items must be of type number',
             each: true ,
             optional: true
         }).add([
             TypeNumber()
         ]);
 
         
         guardian.compile(targetObject);
                 
         guardian.run()
             .then(errors => {
                expect(errors).to.be.of.length(1)
                expect(errors[0].path).to.be.equal('items[$].num')
                done()
             })
             .catch(e => done(e));
     });
})


