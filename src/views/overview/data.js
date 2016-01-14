var _ = require('lodash');


function parse(dialogue) {
  return parseSequence(dialogue.sequences[0], dialogue);
}


function parseSequence(seq, dialogue) {
  return {
    title: seq.name,
    children: _(seq.blocks)
      .filter(blockIsRoutable)
      .map(getBlockSequenceIds)
      .flatten()
      .uniq()
      .map(args(findSequence, dialogue))
      .map(args(parseSequence, dialogue))
      .value()
  };
}


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


getBlockSequenceIds.route = function(block) {
  return [block.seqId];
};


getBlockSequenceIds.askchoice = function(block) {
  return _(block.allChoices)
    .map(function(choice) { return choice.route; })
    .compact()
    .uniq()
    .value();
};


getBlockSequenceIds.conditionalroute = function(block) {
  return [block.seqId];
};


function findSequence(id, dialogue) {
  return _.find(dialogue.sequences, {id: id});
}


function args(fn) {
  var a = _.slice(arguments, 1);

  return function(v) {
    return fn.apply(this, [v].concat(a, _.slice(arguments, 1)));
  };
}


exports.parse = parse;
