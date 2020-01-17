


import { expect } from 'chai';

import { Guardian } from './../lib'
import { NotNull, NotUndefined, Match, Gt } from './../lib/core/layer-operators';




describe('Or Reduction', function () {


    it('Or Reduction no errors.', function (done) {
        const targetObject = {
            name: 'Bob',
            data: {
                age: 25,
                list: [2, null]
            }
        };

        const guardian = new Guardian();
        guardian.on({
            path: 'name',
            errorMessage: 'name is invalid.'
        }).add([
            Match(/[a-z]+(\-[a-z]+)*/)
        ]);

        guardian.on({
            path: 'data.age',
            errorMessage: 'age is required & must be greater than 20.',
            each: true
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



        guardian.orReduction('1', '3');

        guardian.compile(targetObject);


        // guardian.stackSummary();


        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(0)
                done()
            })
            .catch(e => done(e));

    });


    it('Or Reduction errors.', function (done) {
        const targetObject = {
            name: '123 4',
            data: {
                age: 25,
                list: [2, null]
            }
        };

        const guardian = new Guardian();

        guardian.on({
            path: 'data.age',
            errorMessage: 'age is required & must be greater than 20.',
            each: true
        }).add([
            NotNull(),
            Gt(20)
        ]);

        guardian.on({
            path: 'name',
            errorMessage: 'name is invalid.'
        }).add([
            Match(/[a-z]+(\-[a-z]+)*/)
        ]);

        guardian.on({
            path: 'data.list[$]',
            errorMessage: 'all items in list are required',
            each: true
        }).add([
            NotNull()
        ]);


        guardian.orReduction('2', '3');

        guardian.compile(targetObject);

        // guardian.stackSummary();

        guardian.run()
            .then(errors => {
                expect(errors).to.be.of.length(2);
                expect(errors[0].path).to.be.equal('name')
                expect(errors[1].path).to.be.equal('data.list[$]')
                done()
            })
            .catch(e => done(e));


    });


})


