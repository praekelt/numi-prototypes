var drawers = require('../../drawers');
var Ractive = require('ractive');
var conditions = require('../../components/conditions');
var ConditionLibrary = require('../condition-library');


var ConditionSet = Ractive.extend({
  template: require('./template.html'),
  partials: {conditions: require('./conditions.html')},
  components: conditions.types,
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
  addGroup: function() {
    this.push('conditions', conditions.create({type: 'group'}));
  },
  removeCondition: function(id) {
    this.removeWhere('conditions', {id: id});
  },
  close: function() {
    drawers.close(this);
  }
});


module.exports = ConditionSet;
