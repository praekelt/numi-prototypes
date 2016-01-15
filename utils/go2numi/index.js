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
  ({
    end: parseEnd
  }[state.type] || parseUnsupported)(d, state, model);
}


function parseEnd(d, state, model) {
  d.seq.blocks.push(create(blockTypes.end, {
    type: 'end',
    id: state.uuid,
    text: state.text
  }));
}


function parseUnsupported(d, state, model) {
}


function create(type, d) {
  return _.extend({}, type.prototype.data(), {id: uuid.v4()}, d || {});
}


var parsers = {};
parsers.parseEnd = parseEnd;

module.exports = parse;
exports.parsers = parsers;
