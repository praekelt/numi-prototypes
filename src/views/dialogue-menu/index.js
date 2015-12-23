var drawers = require('../../drawers');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  close: function() {
    drawers.close(this);
  }
});
