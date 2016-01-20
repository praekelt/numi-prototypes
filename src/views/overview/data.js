var _ = require('lodash');


function parse(dialogue) {
  return parseSequence(dialogue.sequences[0], null, {
    nodes: [],
    dialogue: dialogue
  });
}


function parseSequence(seq, parent, state) {
  if (inChain(seq, parent)) return;
  return _.find(state.nodes, seq.id)
    ? parseSequence.link(seq, parent, state)
    : parseSequence.node(seq, parent, state);
}


parseSequence.node = function(seq, parent, state) {
  state.nodes.push(seq.id);

  var d = {
    parent: parent,
    id: seq.id,
    title: seq.name,
    isLink: false
  };

  d.children = _(seq.blocks)
    .filter(blockIsRoutable)
    .map(getBlockSequenceIds)
    .flatten()
    .uniq()
    .map(args(findSequence, state))
    .map(args(parseSequence, d, state))
    .compact()
    .value();

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
  do if ((parent || 0).id === seq.id) return true;
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


exports.parse = parse;
