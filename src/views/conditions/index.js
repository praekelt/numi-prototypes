var drawers = require('../../drawers');
var Ractive = require('ractive');
var ConditionLibrary = require('../condition-library');


module.exports = Ractive.extend({
  template: require('./template.html'),
  partials: {conditions: require('./conditions.html')},
  components: require('../../components/conditions'),
  data: function() {
    return {
      type: 'all',
      name: null,
      conditions: []
    };
  },
  addCondition: function() {
    var self = this;

    var library = ConditionLibrary({el: $('<div>')});

    library.on('chosen', function(d) {
      self.push('conditions', d);
      drawers.close(library);
    });

    drawers.open(library);
  },
  removeCondition: function(id) {
    this.removeWhere('conditions', {id: id});
  },
  changeCondition: function(id) {
  },
  close: function() {
    drawers.close(this);
  }
});
