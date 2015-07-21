var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var NewFilter = require('../new-filter');


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
    },
    filters: function() {
      dashboard.update();
      return dashboard.get('filters');
    }
  },
  addBlock: function(type) {
    this.get('source').push('blocks', {type: type});
    pg.pop();
  },
  addFilter: function(filter) {
    this.get('source').push('blocks', {
      type: 'filter',
      filter: filter
    });

    pg.pop();
  },
  newFilter: function()  {
    var newFilter = NewFilter({el: $('<div>')});
    var self = this;

    newFilter.on('created', function(filter) {
      self.addFilter({
        id: filter.get('id'),
        name: filter.get('name')
      });
    });

    pg.pop();
    pg.push(newFilter);
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
    title: 'Send',
    type: 'send'
  }]
}, {
  title: 'User data',
  name: 'user-data',
  blocks: [{
    title: 'Save Answer',
    type: 'saveas'
  }, {
    title: 'Add label',
    type: 'label'
  }]
}, {
  title: 'Calculations',
  name: 'custom-components',
  blocks: [{
    title: 'Validate Clinic Code',
    type: 'validatecliniccode'
  }, {
    title: 'Calculate weeks until due date',
    type: 'calcweeks'
  }]
}, {
  title: 'Placeholders',
  name: 'placeholders',
  blocks: [{
    title: 'Show next 9 months',
    type: 'shownext9months'
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
