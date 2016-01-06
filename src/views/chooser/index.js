var _ = require('lodash');
var drawers = require('../../drawers');
var Drawer = require('../drawer');


module.exports = Drawer.extend({
  template: require('./template.html'),
  choose: function(e, id, d) {
    e.original.preventDefault();
    this.fire('chosen', id, _.find(this.get('items'), {id: id}));
  },
  close: function() {
    drawers.close(this);
  }
});
