var drawers = require('../../../drawers');
var Ractive = require('ractive');


var Base = Ractive.extend({
  partials: {header: require('./header.html')},
  oncomplete: function() {
    this.update('isFirstDrawer');
  },
  computed: {
    isFirstDrawer: function() {
      return drawers.isFirst(this);
    }
  },
  open: function() {
    drawers.open(this);
  },
  close: function() {
    drawers.closeAll();
  },
  back: function() {
    drawers.close(this);
  }
});


module.exports = Base;
