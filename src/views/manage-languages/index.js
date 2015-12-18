var drawers = require('../../drawers');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {languages: dashboard.get('languages')};
  },
  onchange: function(d) {
    dashboard.update();
  },
  close: function() {
    drawers.close(this);
  }
});
