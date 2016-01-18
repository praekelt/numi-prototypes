var _ = require('lodash');
var uuid = require('node-uuid');
var blockTypes = require('../../src/views/blocks');
var Dialogue = require('../../src/views/dialogue');
var Sequence = require('../../src/views/sequence');


function parse(model) {
  var dialogue = create(Dialogue);

  var d = {
    dialogue: dialogue,
    blocks: {},
    model: model
  };

  model.states.forEach(function(state) {
    parseState(d, state, model);
  });

  addStartBlockToSeq(d);

  model.connections.forEach(function(connection) {
    parseConnection(d, connection);
  });

  return d.dialogue;
}


function addStartBlockToSeq(d) {
  var block = d.blocks[d.model.start_state.uuid];
  var seq = seqFromBlock(block);
  addSeq(d, seq);
}


function parseState(d, state) {
  var fn = parseState[state.type] || parseState.fallback;
  var block = fn(d, state);

  block._meta = {
    state: state,
    inSeq: false
  };

  addBlock(d, block);
}


parseState.end = function(d, state) {
  return create(blockTypes.end, {
    type: 'end',
    id: state.uuid,
    text: state.text
  });
};


parseState.freetext = function(d, state) {
  return create(blockTypes.ask, {
    type: 'ask',
    id: state.uuid,
    text: state.text
  });
};


parseState.fallback = function(d, state) {
  return create(blockTypes.annotation, {
    type: 'annotation',
    id: state.uuid,
    text: state.type
  });
};


function parseConnection(d, connection) {
  var source = findBlockFromEndpointId(d, connection.source.uuid);
  var target = findBlockFromEndpointId(d, connection.target.uuid);
  var fn = parseConnection[source._meta.state.type] || parseConnection.fallback;
  fn(d, source, target, connection);
}


parseConnection.end = _.noop;
parseConnection.fallback = parseOneToOneState;


function parseOneToOneState(d, source, target) {
  var sourceSeq = ensureBlockInSeq(d, source);

  if (!isMultiTarget(d, target)) {
    addBlockToSeq(sourceSeq, target);
  }
  else {
    addGotoToSeq(sourceSeq, ensureBlockInSeq(d, target));
  }
}


function create(type, d) {
  return _.extend({}, type.prototype.data(), {id: uuid.v4()}, d || {});
}


function addBlock(d, block) {
  d.blocks[block.id] = block;
}


function addSeq(d, seq) {
  d.dialogue.sequences.push(seq);
  return seq;
}


function seqFromBlock(block, name) {
  name = name || block._meta.state.name;

  var seq = create(Sequence, {
    id: seqIdFromBlock(block),
    name: name
  });


  addBlockToSeq(seq, block);
  return seq;
}


function seqIdFromBlock(block) {
  return 'seq:' + block.id;
}


function addBlockToSeq(seq, block) {
  seq.blocks.push(block);
}


function isMultiTarget(d, target) {
  var uuid = target._meta.state.entry_endpoint.uuid;
  return _.where(d.model.connections, {target: {uuid: uuid}}).length > 1;
}


function addGotoToSeq(seq, targetSeq) {
  addBlockToSeq(seq, createGoto(targetSeq));
}


function createGoto(targetSeq) {
  return create(blockTypes.route, {
    type: 'route',
    seqId: targetSeq.id
  });
}


function getSeqWithBlock(d, block) {
  return _.find(d.dialogue.sequences, {blocks: [{id: block.id}]});
}


function ensureBlockInSeq(d, block) {
  return getSeqWithBlock(d, block)
      || addSeq(d, seqFromBlock(block));
}


function findBlockFromEndpointId(d, endpointId) {
  return _.find(d.blocks, function(block) {
    return _.contains(getStateEndpointIds(block._meta.state), endpointId);
  });
}


function getStateEndpointIds(state) {
  var fn = getStateEndpointIds[state.type] || getStateEndpointIds.fallback;
  return fn(state);
}


getStateEndpointIds.end = function(state) {
  return [state.entry_endpoint.uuid];
};


getStateEndpointIds.fallback = function(state) {
  return [
    state.entry_endpoint.uuid,
    state.exit_endpoint.uuid
  ];
};


module.exports = parse;
