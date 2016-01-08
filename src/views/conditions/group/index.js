var Base = require('../base');
var drawers = require('../../../drawers');


var Group = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {conditionSet: null};
  },
  setConditions: function() {
    var self = this;
    var Conditions = require('../../../views/conditions');

    var conditions = Conditions({
      el: $('<div>'),
      data: this.get('conditionSet')
    });

    conditions.on('change', function() {
      self.set('conditionSet', conditions.get());
    });

    drawers.open(conditions);
  }
});


module.exports = Group;
