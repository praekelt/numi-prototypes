var Base = require('../base');
var ConditionSet = require('../../condition-set');


var ConditionSetDrawer = Base.extend({
  template: require('./template.html'),
  components: {conditions: ConditionSet}
});


module.exports = ConditionSetDrawer;
