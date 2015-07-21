var $ = require('jquery');
var Ractive = require('ractive');
var NewFilter = require('../new-filter');
var pg = require('../../pg');


// TODO something similar to this for filters
var ConditionLibrary = Ractive.extend({
  template: require('./template.html'),
  computed: {
    types: function() {
      return ConditionLibrary.types;
    },
    filters: function() {
      var filter = this.get('filter');

      return dashboard.get('filters')
        .filter(function(otherFilter) {
          return otherFilter.id !== filter.get('id');
        });
    },
    filterId: function() {
      return this.get('filter').get('id');
    },
    filterName: function() {
      return this.get('filter').get('name');
    }
  },
  addCondition: function(type) {
    this.get('filter').push('conditions', {type: type});
    pg.pop();
  },
  addFilter: function(filter) {
    this.get('filter').push('conditions', {
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


ConditionLibrary.types = [{
  title: 'Labels',
  name: 'labels',
  blocks: [{
    title: 'Has label',
    type: 'has'
  }, {
    title: 'Does not have label',
    type: 'nothas'
  }]
}, {
  title: 'Numbers',
  name: 'numbers',
  blocks: [{
    title: 'Equals',
    type: 'eq'
  }, {
    title: 'Not equal to',
    type: 'neq'
  }, {
    title: 'Less than',
    type: 'lt'
  }, {
    title: 'Less than or equal to',
    type: 'lte'
  }, {
    title: 'Greater than',
    type: 'gt'
  }, {
    title: 'Greater than or equal to',
    type: 'gte'
  }]
}, {
  title: 'Text',
  name: 'text',
  blocks: [{
    title: 'Equals',
    type: 'teq'
  }, {
    title: 'Not equal to',
    type: 'tneq'
  }]
}];


module.exports = ConditionLibrary;
