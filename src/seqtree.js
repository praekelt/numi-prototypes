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
  var child;

  if (i < 0) {
    child = create(key);
    i = node.children.length;
    node.children.push(child);
  }
  else {
    child = node.children[i];
  }

  node.currentIdx = i;
  return child;
}


function deselect(node) {
  node.currentIdx = null;
}


function search(root, fn) {
  var result;
  recur(root);
  return result;

  function recur(node) {
    if (fn(node)) {
      result = node;
      return true;
    }
    else {
      node.children.some(recur);
    }
  }
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


function isOnBlock(node, blockId) {
  return node.currentIdx
      && node.children[node.currentIdx].key[1] === blockId;
}


exports.create = create;
exports.select = select;
exports.find = find;
exports.search = search;
exports.all = all;
exports.deselect = deselect;
exports.isOnBlock = isOnBlock;
