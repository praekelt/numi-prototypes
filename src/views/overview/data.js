var _ = require('lodash');
var args = _.partialRight;


function parse(dialogue) {
  return dialogue.sequences
    .map(args(parseSequence, dialogue));
}


function parseSequence(seq, dialogue) {
  return {
    title: seq.name,
    children: _(seq.blocks)
      .filter(blockIsRoutable)
      .map(args(getBlockSequences, dialogue))
      .uniq()
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


function getBlockSequences(block, dialogue) {
  return getBlockSequenceIds(block)
    .map(args(findSequence, dialogue));
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


exports.parse = parse;
