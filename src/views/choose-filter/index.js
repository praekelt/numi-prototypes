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
  setChoice: function(collection) {
    this.get('source').set(this.get('fieldName') || 'filter', collection);
  },
  choose: function(filter) {
    this.setChoice(filter);
    pg.pop();
  },
  newFilter: function() {
    var newFilter = NewFilter({el: $('<div>')});
    newFilter.set('chooser', this);
    pg.pop();
    pg.push(newFilter.el);
  }
});
