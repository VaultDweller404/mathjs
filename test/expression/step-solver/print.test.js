'use strict';

const assert = require('assert');
const math = require('../../../index');
const print = require('../../../lib/expression/step-solver/print.js');

function testPrint(exprStr, outputStr) {
  it(exprStr + ' -> ' + outputStr, function () {
    assert.deepEqual(print(math.parse(exprStr)), outputStr);
  });
}

describe('print asciimath', function () {
  const tests = [
    ['2+3+4', '2 + 3 + 4'],
    ['2 + (4 - x) + - 4', '2 + (4 - x) - 4'],
    ['2/3 x^2', '2/3 x^2'],
    ['-2/3', '-2/3'],
  ];
  tests.forEach(t => testPrint(t[0], t[1]));
});
