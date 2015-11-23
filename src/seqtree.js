var _ = require('lodash');
var uuid = require('node-uuid');


function create(key) {
  return {
    key: key,
    id: uuid.v4(),
    children: [],
    currentIdx: null
  };
}


function select(node, key) {
  var i = _.findIndex(node.children, {key: key});

  if (i < 0) {
    child = create(key);
    i = node.children.length;
    node.children.push(child);
  }

  node.currentIdx = i;
}


function find(root, id) {
  var result;
  recur(root);
  return result;

  function recur(node) {
    if (node.id === id) {
      result = node;
      return true;
    }
    else {
      node.children.some(recur);
    }
  }
}


function all(root) {
  var results = [root];
  add(root);

  function add(node) {
    results.push.apply(results, node.children);
    node.children.forEach(add);
  }

  return results;
}


exports.create = create;
exports.select = select;
exports.find = find;
exports.all = all;
