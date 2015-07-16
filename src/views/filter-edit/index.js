var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var ConditionLibrary = require('../condition-library');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {conditions: []};
  },
  addCondition: function() {
    var library = ConditionLibrary({el: $('<div>')});
    library.set('filter', this);
    pg.push(library.el);
  },
  components: {
    lte: require('../../components/conditions/lte'),
  }
});
