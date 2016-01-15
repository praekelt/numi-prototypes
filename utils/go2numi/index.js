var _ = require('lodash');
var uuid = require('node-uuid');
var blockTypes = require('../../src/views/blocks');
var Dialogue = require('../../src/views/dialogue');
var Sequence = require('../../src/views/sequence');


function parse(model) {
  var dialogue = create(Dialogue, {
    sequences: [create(Sequence)]
  });

  var d = {
    dialogue: dialogue,
    seq: dialogue.sequences[0]
  };

  model.states.forEach(function(state) {
    parseState(d, state, model);
  });

  return d.dialogue;
}


function parseState(d, state, model) {
  (parseState[state.type] || parse.fallback)(d, state, model);
}


parseState.end = function(d, state, model) {
  d.seq.blocks.push(create(blockTypes.end, {
    type: 'end',
    id: state.uuid,
    text: state.text
  }));
};


parseState.freetext = function(d, state, model) {
  d.seq.blocks.push(create(blockTypes.ask, {
    type: 'ask',
    id: state.uuid,
    text: state.text
  }));
};


parse.fallback = function(d, state, model) {
};


function create(type, d) {
  return _.extend({}, type.prototype.data(), {id: uuid.v4()}, d || {});
}


module.exports = parse;
