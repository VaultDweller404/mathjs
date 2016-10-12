'use strict';
/*
  For determining the type of a mathJS node.
 */

const NodeType = {}

NodeType.isOperator = function(node) {
  return node.type === 'OperatorNode' && node.fn !== 'unaryMinus';
};

NodeType.isParenthesis = function(node) {
  return node.type === 'ParenthesisNode';
};

NodeType.isUnaryMinus = function(node) {
  return node.type === 'OperatorNode' && node.fn === 'unaryMinus';
};

NodeType.isSymbol = function(node, allowUnaryMinus=true) {
  if (node.type === 'SymbolNode') {
    return true;
  }
  else if (allowUnaryMinus && NodeType.isUnaryMinus(node)) {
    return NodeType.isSymbol(node.args[0], false);
  }
  else {
    return false;
  }
};

NodeType.isConstant = function(node, allowUnaryMinus=false) {
  if (node.type === 'ConstantNode') {
    return true;
  }
  else if (allowUnaryMinus && NodeType.isUnaryMinus(node)) {
    return NodeType.isConstant(node.args[0], false);
  }
  else {
    return false;
  }
};

module.exports = NodeType;