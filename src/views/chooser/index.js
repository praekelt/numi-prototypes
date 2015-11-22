var drawers = require('../../drawers');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  choose: function(e, id) {
    e.original.preventDefault();
    this.fire('chosen', id);
  },
  close: function() {
    drawers.close(this);
  }
});
