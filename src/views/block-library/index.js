var Ractive = require('ractive');
var pg = require('../../pg');


// TODO something similar to this for filters
var BlockLibrary = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      events: BlockLibrary.events,
      types: BlockLibrary.types,
      disableEvents: false
    };
  },
  addBlock: function(type) {
    this.get('source').push('blocks', {type: type});
    pg.pop();
  }
});


BlockLibrary.events = {
  title: 'Events',
  name: 'events',
  blocks: [{
    title: 'User dials in',
    type: 'userdialsin'
  }, {
    title: 'User sends message',
    type: 'usersendsmessage'
  }, {
    title: 'Scheduled',
    type: 'scheduled'
  }, {
    title: 'Manual',
    type: 'manual'
  }]
};


BlockLibrary.types = [{
  title: 'Interactions',
  name: 'interactions',
  blocks: [{
    title: 'Ask',
    type: 'ask'
  }, {
    title: 'Choice',
    type: 'choice'
  }, {
    title: 'End',
    type: 'end'
  }]
}, {
  title: 'Custom components',
  name: 'custom-components',
  blocks: [{
    title: 'Validate Clinic Code',
    type: 'validatecliniccode'
  }, {
    title: 'Show next 9 months',
    type: 'shownext9months'
  }]
}, {
  title: 'Message sets',
  name: 'message-sets',
  blocks: [{
    title: 'Standard Message Set',
    type: 'standardmessageset'
  }, {
    title: 'Later Message Set',
    type: 'latermessageset'
  }, {
    title: 'Accelerated MessageSet',
    type: 'acceleratedmessageset'
  }]
}];


BlockLibrary.isEvent = function(block) {
  return !!BlockLibrary.events
    .blocks
    .filter(function(d) {
      return d.type === block.type;
    })
    .length;
};


module.exports = BlockLibrary;
