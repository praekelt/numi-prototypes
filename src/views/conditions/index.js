var drawers = require('../../drawers');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      type: 'all',
      conditions: []
    };
  },
  addCondition: function() {
  },
  close: function() {
    drawers.close(this);
  }
});
