var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var NewFilter = require('../new-filter');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    filters: function() {
      var filter = this.get('filter');
      if (!filter) return dashboard.get('filters');

      return dashboard.get('filters')
        .filter(function(otherFilter) {
          return filter.get('id') !== otherFilter.id;
        });
    }
  },
  setChoice: function(filter) {
    this.get('source').set(this.get('fieldName') || 'filter', filter);
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
