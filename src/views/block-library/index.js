var $ = require('jquery');
var uuid = require('node-uuid');
var Ractive = require('ractive');
var pg = require('../../pg');
var NewFilter = require('../new-filter');


// TODO something similar to this for filters
var BlockLibrary = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      key: 'blocks',
      extra: {},
      events: BlockLibrary.events,
      types: BlockLibrary.types,
      disableEvents: false
    };
  },
  computed: {
    collection: function() {
      var collection = this.get('collectionView');
      if (!collection) return null;

      return {
        id: collection.get('id'),
        name: collection.get('name')
      };
    },
    filters: function() {
      dashboard.update();
      return dashboard.get('filters');
    }
  },
  _addBlock: function(d) {
    var key = this.get('key');
    var source = this.get('source');
    d.id = uuid.v4();
    source.push(key, d);
    source.fire('blockAdded');
  },
  addBlock: function(type) {
    this._addBlock({
      type: type,
      mode: 'edit'
    });
    pg.pop();
  },
  addFilter: function(filter) {
    this._addBlock({type: 'filter'});
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


BlockLibrary.types = [{
  title: 'Events',
  name: 'events',
  blocks: [{
    title: 'User dials in',
    type: 'userdialsin',
    helptext: 'Run this collection when the user dials in'
  }]
}, {
  title: 'Interactions',
  name: 'interactions',
  blocks: [{
    title: 'Ask',
    type: 'ask',
    helptext: 'Asks the user a question, and wait for a response.'
  }, {
    title: 'Send',
    type: 'send',
    helptext: 'Send the user a message.'
  }]
}, {
  title: 'User data actions',
  name: 'user-data',
  blocks: [{
    title: 'Save Answer',
    type: 'saveas',
    helptext: 'Save the user\'s answers for use in a Collection or a filter.'
  }, {
    title: 'Add label to user',
    type: 'label',
    helptext: 'Add a label to the user to refer to them in a Collection or a filter.'
  }, {
    title: 'Remove label',
    type: 'rmlabel',
    helptext: 'Remove a label from a user.'
  }]
}, {
  title: 'Calculations',
  name: 'custom-components',
  blocks: [{
    title: 'Validate Clinic Code',
    type: 'validatecliniccode',
    userinput: 'Clinic Code.',
    action: 'Checks user input against our approved list of Clinic Codes, supplied by NDOH and stored in Django, etc.',
    output: 'Valid or Invalid status.'
  }, {
    title: 'Calculate weeks until due',
    type: 'calcweeks',
    userinput: 'Month that baby is due.',
    action: 'Calculates number of weeks until baby is due.',
    output: 'Number.'
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
