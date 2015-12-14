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
      conditions: [],
      operatorSpan: 1
    };
  },
  computed: {
    operandSpan: function() {
      return Math.floor((21 - this.get('operatorSpan')) / 2);
    }
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
    this.findComponentWhere({id: id}).edit();
  },
  close: function() {
    drawers.close(this);
  }
});
