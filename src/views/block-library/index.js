var $ = require('jquery');
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
    this.get('source').push(key, d);
  },
  addBlock: function(type) {
    this._addBlock({type: type});
    pg.pop();
  },
  addFilter: function(filter) {
    this._addBlock({
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


BlockLibrary.types = [{
  title: 'Interactions',
  name: 'interactions',
  blocks: [{
    title: 'Ask',
    type: 'ask'
  }, {
    title: 'Send',
    type: 'send'
  }]
}, {
  title: 'User data actions',
  name: 'user-data',
  blocks: [{
    title: 'Save Answer',
    type: 'saveas'
  }, {
    title: 'Add label',
    type: 'label'
  }, {
    title: 'Remove label',
    type: 'rmlabel'
  }]
}, {
  title: 'Calculations',
  name: 'custom-components',
  blocks: [{
    title: 'Validate Clinic Code',
    type: 'validatecliniccode',
    userinput: 'Clinic Code.',
    action: 'Checks user input against our list of Clinic Codes.',
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
