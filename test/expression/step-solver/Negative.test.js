'use strict';

const assert = require('assert');
const math = require('../../../index');

const flatten = require('../../../lib/expression/step-solver/flattenOperands.js');
const PolynomialTermNode = require('../../../lib/expression/step-solver/PolynomialTermNode.js');
const Negative = require('../../../lib/expression/step-solver/Negative.js');

function testNegate(exprString, outputStr) {
  it(exprString + ' -> ' + outputStr, function () {
    assert.deepEqual(
      Negative.negate(flatten(math.parse(exprString))),
      flatten(math.parse(outputStr)));
  });
}

describe('negatePolynomialTerm', function() {
  const tests = [
    ['1', '-1'],
    ['-1', '1'],
    ['1/2', '-1/2'],
    ['(x+2)', '-(x+2)'],
    ['x', '-x'],
    ['x^2', '-x^2'],
    ['-y^3', 'y^3'],
    ['2/3 x', '-2/3 x'],
    ['-5/6 z', '5/6 z'],
  ];
  tests.forEach(t => testNegate(t[0], t[1]));
});
