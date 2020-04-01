


import { expect } from 'chai';

import {
    NotNull,
    NotUndefined,
} from './../../lib/core/layer-operators/existents-operators';




describe('Existents Operators', function () {


    it('NotNull Operator', function () {

        const operator = NotNull;

        const tests = [
            { input: 'Hello', expected: true },
            { input: undefined, expected: false },
            { input: null, expected: false }
        ];


        const sequentialLayer =  (operator()).coreOperation(undefined, [], [])
        const { action, name } = sequentialLayer;

        expect(name).to.be.eql('NotNull')

        for(let test of tests) {
            expect( action(test.input) ).to.be.eq(test.expected)
        }

    });

    it('NotUndefined Operator', function () {

        const operator = NotUndefined;

        const tests = [
            { input: 'Hello', expected: true },
            { input: undefined, expected: false },
            { input: null, expected: false }
        ];


        const sequentialLayer = (operator()).coreOperation(undefined, [], [])
        const { action, name } = sequentialLayer;

        expect(name).to.be.eql('NotUndefined')

        for(let test of tests) {
            expect( action(test.input) ).to.be.eq(test.expected)
        }

    });
    
})


