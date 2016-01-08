var drawers = require('../../drawers');
var Base = require('../base');
var conditions = require('../../components/conditions');
var ConditionLibrary = require('../condition-library');


var ConditionSet = Base.extend({
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


module.exports = ConditionSet;
