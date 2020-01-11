


import { expect } from 'chai';

import { Guardian } from './../lib'
import { NotNull, NotUndefined } from './../lib/core/layer-operators';




describe('General Usage', function() {


    it('Using multi path', function(done) {
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
            NotNull(), 
            NotUndefined()
        ]);
                
        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(1)
                expect(errors[0].path).to.be.equal('data.address')
                done()
            })
            .catch(e => done(e));

    }) 

    
    it('Using "each" option on a nested array', function(done) {

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
            path: 'data.list[$].num',         
            errorMessage: 'all items in items list are required',
            each: true 
        }).add([
            NotNull()
        ]);

        
        guardian.compile(targetObject);
                
        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(1)
                expect(errors[0].path).to.be.equal('data.list[$].num')
                done()
            })
            .catch(e => done(e));
    }) 
})


