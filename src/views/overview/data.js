var _ = require('lodash');
var uuid = require('node-uuid');


function parse(dialogue, opts) {
  opts = _.defaults(opts || {}, {
    seq: dialogue.sequences[0],
    maxDepth: null,
    maxExpandDepth: 3
  });

  return parseSequence(opts.seq, null, 0, {
    nodes: [],
    dialogue: dialogue,
    maxDepth: opts.maxDepth,
    maxExpandDepth: opts.maxExpandDepth
  });
}


function parseSequence(seq, parent, depth, state) {
  if (inChain(seq, parent)) return;
  if (state.maxDepth && depth >= state.maxDepth) return;
  return parseSequence.node(seq, parent, depth + 1, state);
}


parseSequence.node = function(seq, parent, depth, state) {
  state.nodes.push(seq.id);

  var d = {
    parent: parent,
    id: uuid.v4(),
    seqId: seq.id,
    title: seq.name,
    isLink: false,
  };

  d._children = _(seq.blocks)
    .filter(blockIsRoutable)
    .map(getBlockSequenceIds)
    .flatten()
    .uniq()
    .map(args(findSequence, state))
    .map(args(parseSequence, d, depth, state))
    .compact()
    .value();

  setExpanded(d, state.maxExpandDepth != null && depth <= state.maxExpandDepth);
  return d;
};


parseSequence.link = function(seq) {
  return {
    title: seq.name,
    parent: parent,
    isLink: true,
    children: []
  };
};


function blockIsRoutable(block) {
  // TODO better way of doing this
  return _.contains([
    'route',
    'askchoice',
    'conditionalroute'
  ], block.type);
}


function getBlockSequenceIds(block) {
  return getBlockSequenceIds[block.type](block);
}


function inChain(seq, parent) {
  do if ((parent || 0).seqId === seq.id) return true;
  while ((parent = (parent || 0).parent));
  return false;
}


getBlockSequenceIds.route = function(block) {
  return [block.seqId];
};


getBlockSequenceIds.askchoice = function(block) {
  return _(block.stash.allChoices)
    .map(function(choice) { return choice.route; })
    .compact()
    .uniq()
    .value();
};


getBlockSequenceIds.conditionalroute = function(block) {
  return [block.seqId];
};


function findSequence(id, state) {
  return _.find(state.dialogue.sequences, {id: id});
}


function args(fn) {
  var a = _.slice(arguments, 1);

  return function(v) {
    return fn.apply(this, [v].concat(a, _.slice(arguments, 1)));
  };
}


function setExpanded(node, expanded) {
  node.expanded = expanded;
  if (expanded) node.children = node._children;
  else node.children = null;

  node._children
    .filter(hasOneChild)
    .forEach(args(setExpanded, expanded));
}


function hasOneChild(node) {
  return node._children.length === 1;
}


exports.parse = parse;
exports.setExpanded = setExpanded;
