'use strict';

const math = require('../../../index');

const Fraction = require('./Fraction');
const PolynomialTermNode = require('./PolynomialTermNode');
const NodeCreator = require('./NodeCreator');
const NodeType = require('./NodeType');

// Prints an expression node properly.
// If latex is true, will return latex, otherwise will return asciimath
// If showPlusMinus is true, print + - (e.g. 2 + -3)
// If it's false (the default) 2 + -3 would print as 2 - 3
// This supports the conversion of subtraction to addition of negative terms,
// which is needed to flatten operands.
function prettyPrint(node, latex=false, showPlusMinus=false, color=false) {
  if (!node) {
    return "";
  }
  let string = prettyPrintColor(node, latex, color);
  if (!showPlusMinus) {
    string = string.replace(/\s*?\+\s*?\-\s*?/g, ' - ');
    string = string.replace(/\s*?\+\s*?\\color{\w*}{\s*?\-\s*?/g, match => {
      match = match.replace('-', '');
      match = match.replace('+', '-');
      return match;
    });
    string = string.replace(/\s*?\+\s*?\\color{\w*}{\\frac{\s*?\-\s*?/g, match => {
      match = match.replace('-', '');
      match = match.replace('+', '-');
      return match;
    });
  }
  return string;
}

const COLORS = {
  1: "SpringGreen",
  2: "Salmon",
  3: "Yellow",
  4: "Orange",
};

function prettyPrintColor(node, latex, color) {
  let string = prettyPrintDFS(node, latex, color);
  if (latex && color && node.changeGroup) {
    string = `\\color{${COLORS[node.changeGroup]}}{${string}}`;
    console.log(string);
  }
  return string;
}

function prettyPrintDFS(node, latex, color) {
  if (PolynomialTermNode.isPolynomialTerm(node)) {
    const polyTerm = new PolynomialTermNode(node);
    // This is so we don't print 2/3 x^2 as 2 / 3x^2
    // Still print x/2 as x/2 and not 1/2 x though
    if (polyTerm.hasFractionCoeff() && node.op !== '/') {
      const coeffTerm = polyTerm.getCoeffNode();
      const coeffStr = prettyPrintColor(coeffTerm, latex, color);

      const nonCoeffTerm = NodeCreator.polynomialTerm(
        polyTerm.symbol, polyTerm.exponent, null);
      const nonCoeffStr = prettyPrintColor(nonCoeffTerm, latex, color);

      return `${coeffStr} ${nonCoeffStr}`;
    }
  }
  if (NodeType.isIntegerFraction(node)) {
    if (latex) {
      // fractions in latex are different than in asciimath
      return `\\frac{${node.args[0]}}{${node.args[1]}}`;
    }
    else {
      return `${node.args[0]}/${node.args[1]}`;
    }
  }
  if (NodeType.isOperator(node)) {
    if (latex) {
      // fractions and exponents in latex are different than in asciimath
      if (node.op == '/') {
        return `\\frac{${prettyPrintColor(node.args[0], latex, color)}}` +
               `{${prettyPrintColor(node.args[1], latex, color)}}`;
      }
      else if (node.op == '^') {
        return `{${prettyPrintColor(node.args[0], latex, color)}}^` +
               `{${prettyPrintColor(node.args[1], latex, color)}}`;
      }
    }
    if (node.op === '/' && NodeType.isOperator(node.args[1])) {
      return `${prettyPrintColor(node.args[0], latex, color)} / ` +
             `(${prettyPrintColor(node.args[1], latex, color)})`;
    }

    let str = prettyPrintColor(node.args[0], latex, color);
    for (let i = 1; i < node.args.length; i++) {
      switch (node.op) {
        case '*':
          if (node.implicit) {
            break;
          }
          if (latex) {
            str += ` \\cdot `;
            break;
          }
        case '+':
        case '-':
          // add space between operator and operands
          str += ` ${node.op} `;
          break;
        case '/':
          // no space for constant fraction divisions (slightly easier to read)
          if (NodeType.isConstantFraction(node, true)) {
            str += `${node.op}`;
          }
          else {
            str += ` ${node.op} `;
          }
          break;
        case '^':
          // no space for exponents
          str += `${node.op}`;
          break;
      }
      str += prettyPrintColor(node.args[i], latex, color);
    }
    return str;
  }
  else if (NodeType.isParenthesis(node)) {
    if (latex) {
      return `(${prettyPrintColor(node.content, latex, color)})`;
    }
    else {
      return `(${prettyPrintColor(node.content, latex, color)})`;
    }
  }
  else if (NodeType.isUnaryMinus(node)) {
    if (NodeType.isOperator(node.args[0]) &&
        node.args[0].op !== '/' &&
        !PolynomialTermNode.isPolynomialTerm(node)) {
      return `-(${prettyPrintColor(node.args[0], latex, color)})`;
    }
    else {
      return `-${prettyPrintColor(node.args[0], latex, color)}`;
    }
  }
  else {
    return node.toString();
  }
}

module.exports = prettyPrint;
