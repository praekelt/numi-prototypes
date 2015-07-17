var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var NewFilter = require('../new-filter');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    filters: function() {
      return dashboard.get('filters');
    }
  },
  setChoice: function(filter) {
    this.get('source').set(this.get('fieldName') || 'filter', {
      id: filter.get('id'),
      name: filter.get('name')
    });
  },
  choose: function(filter) {
    this.setChoice(filter);
    pg.pop();
  },
  newFilter: function() {
    var newFilter = NewFilter({el: $('<div>')});
    var self = this;

    newFilter.on('created', function(filter) {
      self.setChoice(filter);
    });

    pg.pop();
    pg.push(newFilter.el);
  }
});
