var _ = require('lodash');
var uuid = require('node-uuid');


function create(key) {
  return {
    key: key,
    id: uuid.v4(),
    children: [],
    current: null
  };
}


function select(node, key) {
  var child = _.find(node.children, {key: key});

  if (!child) {
    child = create(key);
    node.children.push(child);
  }

  node.current = child;
}


function find(root, id) {
  return _.find(all(root), {id: id});
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
