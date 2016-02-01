var _ = require('lodash');
var drawers = require('../../drawers');
var Ractive = require('ractive');
var conditions = require('../conditions');
var ConditionLibrary = require('../drawers/condition-library');


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
  }
});


ConditionSet.isComplete = function(d) {
  return _(d.conditions)
    .map(function(d) {
      return conditions.types[d.type].isComplete(d);
    })
    .every();
};


ConditionSet.Preview = Ractive.extend({
  template: require('./preview.html'),
  partials: {conditions: require('../condition-set/conditions.html')},
  components: _.mapValues(conditions.types, 'Preview')
});


module.exports = ConditionSet;
