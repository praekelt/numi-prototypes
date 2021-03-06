#!/usr/bin/env node

// prevent warnings from messing up output
var log = console.log.bind(console);
if (require.main === module) console.log = function(){};

var jsdom = require('jsdom');
setupDom();

require('ractive-require-templates');
require('../../src/ractive-extensions');
var _ = require('lodash');
var uuid = require('node-uuid');
var blockTypes = require('../../src/views/blocks');
var Dashboard = require('../../src/views/dashboard');
var Sequence = require('../../src/views/sequence');

function run() {
  // prevent warnings from messing up output
  var result = parse(require(process.argv[2]));
  log(JSON.stringify(result));
}


function parse(model) {
  var dashboard = Dashboard();
  var name = model.states[0].name;
  dashboard.set('name', name);

  // the prototype expects a dashboard global variable
  // yes, I know it is terrible
  global.dashboard = dashboard;

  var view = dashboard.addDialogue(name);
  var dialogue = view.get();

  var d = {
    dialogue: dialogue,
    blocks: [],
    model: model,
    view: view,
    dashboard: dashboard
  };

  removeBackConnections(d);

  model.states.forEach(function(state) {
    parseState(d, state, model);
  });

  addStartBlockToSeq(d);

  model.connections.forEach(function(connection) {
    parseConnection(d, connection);
  });

  d.blocks
    .forEach(function(block) {
      computeBlock(d, block);
    });

  return serialize(d);
}


function serialize(d) {
  var result = d.dashboard.get();
  result.dialogues = [d.dialogue];
  return result;
}


function addStartBlockToSeq(d) {
  var block = _.find(d.blocks, {id: d.model.start_state.uuid});
  addBlockToSeq(d.dialogue.sequences[0], block);
}


function parseState(d, state) {
  var fn = parseState[state.type] || parseState.fallback;
  var block = fn(d, state);

  block._meta = {state: state};
  addBlock(d, block);
}


function computeBlock(d, block) {
  var type = blockTypes[block.type];
  var computedKeys = _.keys(type.prototype.computed);

  var view = type({
    data: _.extend(_.omit(block, computedKeys), {_dialogue: d.view})
  });

  computedKeys
    .forEach(function(k) {
      if (k in block) view.set(k, block[k]);
    });

  _(block)
    .extend(view.get())
    .tap(rmProps(['_dialogue', '_']))
    .value();
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


parseState.choice = function(d, state) {
  return create(blockTypes.askchoice, {
    type: 'askchoice',
    id: state.uuid,
    text: state.text,
    allChoices: state.choice_endpoints
      .map(choiceFromEndpoint)
      .concat(createChoice())
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

  var fn = parseConnection[getBlockState(source).type]
        || parseConnection.fallback;

  fn(d, source, target, connection);
}


parseConnection.end = _.noop;


parseConnection.choice = function(d, source, target, connection) {
  var sourceSeq = ensureBlockInSeq(d, source);
  var choices = choicesWithTarget(d, source, target);
  choices = _.reject(choices, choiceHasRoute);

  // all choices have the same target, last allChoices item is a stub
  if (choices.length === choicesWithConnections(d, source).length) {
    addBlockToSeq(sourceSeq, target);
    return;
  }

  if (choices.some(isMoreChoice)) {
    addBlockToSeq(sourceSeq, target);
    return;
  }

  var targetSeq = ensureBlockInSeq(d, target);

  _(choices)
    .reject(isNavChoice)
    .each(function(choice) { choice.route = targetSeq.id; })
    .value();
};


parseConnection.fallback = function(d, source, target) {
  var sourceSeq = ensureBlockInSeq(d, source);

  if (isMultiTarget(d, target)) {
    addGotoToSeq(sourceSeq, ensureBlockInSeq(d, target));
  }
  else {
    addBlockToSeq(sourceSeq, target);
  }
};


function create(type, d) {
  return _.extend({}, type.prototype.data(), {id: uuid.v4()}, d || {});
}


function addBlock(d, block) {
  d.blocks.push(block);
}


function addSeq(d, seq) {
  d.dialogue.sequences.push(seq);
  return seq;
}


function seqFromBlock(block, name) {
  name = name || getBlockState(block).name;

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
  if (!_.find(seq.blocks, {id: block.id})) seq.blocks.push(block);
}


function isMultiTarget(d, target) {
  return blocksWithTarget(d, target).length > 1;
}


function blocksWithTarget(d, target) {
  var sourceIds = sourcesWithTarget(d, target);

  return d.blocks
    .filter(function(block) {
      var endpointIds = getStateExitEndpointIds(getBlockState(block));
      return _.intersection(sourceIds, endpointIds).length > 0;
    });
}


function connectionsWithTarget(d, target) {
  var targetId = getBlockState(target).entry_endpoint.uuid;

  return d.model.connections
    .filter(function(connection) {
      return connection.target.uuid === targetId;
    });
}


function sourcesWithTarget(d, target) {
  return connectionsWithTarget(d, target)
    .map(function(connection) {
      return connection.source.uuid;
    });
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
    return _.contains(getStateEndpointIds(getBlockState(block)), endpointId);
  });
}


function getStateEndpointIds(state) {
  return [state.entry_endpoint.uuid]
    .concat(getStateExitEndpointIds(state));
}


function getStateExitEndpointIds(state) {
  return _.pluck(getStateExitEndpoints(state), 'uuid');
}


function getStateExitEndpoints(state) {
  var fn = getStateExitEndpoints[state.type]
        || getStateExitEndpoints.fallback;

  return fn(state);
}


getStateExitEndpoints.end = function(state) {
  return [];
};


getStateExitEndpoints.choice = function(state) {
  return state.choice_endpoints;
};


getStateExitEndpoints.fallback = function(state) {
  return [state.exit_endpoint];
};


function getBlockState(block) {
  return block._meta.state;
}


function getChoiceEndpoint(choice) {
  return choice._meta.endpoint;
}


function choicesWithTarget(d, block, target) {
  var sourceIds = sourcesWithTarget(d, target);

  return block.allChoices
    .slice(0, -1)
    .filter(function(choice) {
      return _.contains(sourceIds, getChoiceEndpoint(choice).uuid);
    });
}

function choicesWithConnections(d, block) {
  var sourceIds = d.model.connections
    .map(function(connection) {
      return connection.source.uuid;
    });

  return block.allChoices
    .slice(0, -1)
    .filter(function(choice) {
      return _.contains(sourceIds, getChoiceEndpoint(choice).uuid);
    });
}


function choiceFromEndpoint(endpoint) {
  return createChoice({
    text: endpoint.label,
    _meta: {endpoint: endpoint}
  });
}


function choiceHasRoute(choice) {
  return choice.route != null;
}


function isNavChoice(choice) {
  return isBackChoice(choice)
      || isMoreChoice(choice);
}


function isBackChoice(choice) {
  return isBackEndpoint(getChoiceEndpoint(choice));
}


function isMoreChoice(choice) {
  return isMoreEndpoint(getChoiceEndpoint(choice));
}


function isBackEndpoint(endpoint) {
  return /^back$/i.test(endpoint.label);
}


function isMoreEndpoint(endpoint) {
  return /^more$/i.test(endpoint.label);
}


function createChoice(d) {
  return _.extend(
    blockTypes.askchoice.prototype.newChoice(),
    {id: uuid.v4()},
    d || {});
}


function removeBackConnections(d) {
  d.model.connections = d.model.connections
    .filter(function(connection) {
      return !isBackConnection(d, connection);
    });
}


function isBackConnection(d, connection) {
  var uuid = connection.source.uuid;

  return d.model.states
    .some(function(state) {
      var endpoint = _.find(getStateExitEndpoints(state), {uuid: uuid});
      return endpoint && isBackEndpoint(endpoint);
    });
}


function setupDom() {
  global.window = jsdom.jsdom().defaultView;
  global.document = global.window.document;
}


function rmProps(props) {
  return function(obj) {
    var n = props.length;
    var i = -1;
    while (++i < n) delete obj[props[i]];
  }
}


module.exports = parse;
if (require.main === module) run();
