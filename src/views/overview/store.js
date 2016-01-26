var args = require('../../utils').args;


function setExpanded(node, expanded) {
  setNodeExpanded(node, expanded);
}


function hasOneChild(node) {
  return node._children.length === 1;
}


function setNodeExpanded(node, expanded) {
  if (node._children.length < 1) return;
  node.expanded = expanded;
  if (expanded) node.children = node._children;
  else node.children = null;
}


function isLeafNode(node) {
  return node._children.length < 1;
}


function isInnerNode(node) {
  return node._children.length > 0;
}


function isExpanded(node) {
  return node.expanded;
}

function isCollapsed(node) {
  return !node.expanded;
}


function setSelected(node, selected, root) {
  walk(root, function(node) {
    setNodeSelected(node, false);
  });

  while (node) {
    setNodeSelected(node, selected);
    node = node.parent;
  }
}


function setNodeSelected(node, selected) {
  node.selected = selected;
}


function toggleSelected(node, root) {
  setSelected(node, !isSelected(node), root);
}


function isSelected(node) {
  return node.selected;
}


function walk(root, fn) {
  each(root, fn);

  function each(node) {
    fn(node);
    node._children.forEach(each);
  }
}


exports.setExpanded = setExpanded;
exports.isLeafNode = isLeafNode;
exports.isInnerNode = isInnerNode;
exports.isExpanded = isExpanded;
exports.isCollapsed = isCollapsed;
exports.setSelected = setSelected;
exports.toggleSelected = toggleSelected;
exports.isSelected = isSelected;
exports.walk = walk;
