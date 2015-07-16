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
  computed: {
    collection: function() {
      var screen = this.get('source');
      if (!screen) return null;

      return {
        id: screen.parent.get('id'),
        name: screen.parent.get('name')
      };
    }
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
  }, {
    title: 'Save As',
    type: 'saveas'
  }]
}, {
  title: 'Filters',
  name: 'filters',
  blocks: [{
    title: 'Gestation < 30 weeks',
    type: 'gestationlessthan30'
  }, {
    title: 'Gestation is a weird word',
    type: 'gestationweird'
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


BlockLibrary.isEvent = function(type) {
  return !!BlockLibrary.events
    .blocks
    .filter(function(d) {
      return d.type === type;
    })
    .length;
};


module.exports = BlockLibrary;
