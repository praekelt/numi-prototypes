var args = require('../../utils').args;
var seqtree = require('../../seqtree');


function setExpanded(node, expanded) {
  setNodeExpanded(node, expanded);

  node._children
    .filter(hasOneChild)
    .forEach(args(setNodeExpanded, expanded));
}


function hasOneChild(node) {
  return node._children.length === 1;
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
  root = root || node;

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


function setCurrent(node, current) {
  node.current = current;
  if (current) setExpanded(node, true);
}


function isCurrent(node) {
  return node.current;
}


function walk(root, fn) {
  each(root, fn);

  function each(node) {
    fn(node);
    node._children.forEach(each);
  }
}


function applyToSeqtree(root, seqtreeRoot, sequences) {
  var path = getSelectedPath(root)
    .map(getSeqId)
    .map(args(findSequence, sequences));

  var node = seqtreeRoot;
  var target = path.shift();
  var source;
  var key;

  while ((source = target) && (target = path.shift())) {
    key = findBlockItemWithTarget(source, target);
    node = seqtree.select(node, key);
  }

  deselectRemainingSeqtree(node);
  return seqtreeRoot;
}


function deselectRemainingSeqtree(node) {
  while (node && ((i = node.currentIdx) != null)) {
    seqtree.deselect(node);
    node = node.children[i];
  }
}


function getSeqId(node) {
  return node.seqId;
}


function findSequence(id, sequences) {
  return _.find(sequences, {id: id});
}


function getSelectedPath(node) {
  var path = [];
  do path.push(node);
  while ((node = _.find(node._children, isSelected)));
  return path;
}


function findBlockItemWithTarget(source, target) {
  var item = _(source.blocks)
    .map(getBlockItems)
    .flatten()
    .find({seqId: target.id});

  return [item.seqId, item.blockId, item.itemId];
}


function getBlockItems(block) {
  return (getBlockItems[block.type] || getBlockItems.fallback)(block);
}


getBlockItems.route = function(block) {
  return [{
    blockId: block.id,
    seqId: block.seqId,
    itemId: block.itemId
  }];
};


getBlockItems.askchoice = function(block) {
  return block.stash.allChoices
    .slice(0, -1)
    .map(function(choice) {
      return {
        blockId: block.id,
        seqId: choice.route,
        itemId: choice.id
      };
    });
};


getBlockItems.conditionalroute = function(block) {
  return [{
    blockId: block.id,
    itemId: block.itemId,
    seqId: block.seqId
  }];
};


getBlockItems.fallback = function() {
  return [];
};


exports.setExpanded = setExpanded;
exports.isLeafNode = isLeafNode;
exports.isInnerNode = isInnerNode;
exports.isExpanded = isExpanded;
exports.isCollapsed = isCollapsed;
exports.setSelected = setSelected;
exports.toggleSelected = toggleSelected;
exports.isSelected = isSelected;
exports.walk = walk;
exports.applyToSeqtree = applyToSeqtree;
exports.setCurrent = setCurrent;
exports.isCurrent = isCurrent;
