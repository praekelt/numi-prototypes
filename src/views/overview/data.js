var _ = require('lodash');
var uuid = require('node-uuid');
var args = require('../../utils').args;
var seqtree = require('../../seqtree');
var store = require('./store');


function parse(dialogue, opts) {
  opts = _.defaults(opts || {}, {
    seq: dialogue.sequences[0],
    maxDepth: null,
    maxExpandDepth: 2
  });

  var root = parseSequence(opts.seq, null, 0, {
    nodes: [],
    dialogue: dialogue,
    maxDepth: opts.maxDepth,
    maxExpandDepth: opts.maxExpandDepth
  });

  applySeqtree(root, dialogue.seqtree);
  return root;
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
    selected: false,
    current: false
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

  var expanded = state.maxExpandDepth != null && depth <= state.maxExpandDepth;
  store.setExpanded(d, expanded);
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
  return block.seqId
    ? [block.seqId]
    : [];
};


getBlockSequenceIds.askchoice = function(block) {
  return _(block.stash.allChoices)
    .map(function(choice) { return choice.route; })
    .compact()
    .uniq()
    .value();
};


getBlockSequenceIds.conditionalroute = function(block) {
  return block.seqId
    ? [block.seqId]
    : [];
};


function applySeqtree(root, seqtreeRoot) {
  var node = root;

  seqtree.walkCurrent(seqtreeRoot, function(seqtreeNode) {
    if (!node) return;

    store.setCurrent(node, true);
    var target = seqtreeNode.children[seqtreeNode.currentIdx];
    var id;

    if (target) {
      id = target.key[0];
      node = _.find(node._children, {seqId: id});
    }
  });
}


function findSequence(id, state) {
  return _.find(state.dialogue.sequences, {id: id});
}


exports.parse = parse;
