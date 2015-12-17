var _ = require('lodash');
var drawers = require('../../drawers');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  choose: function(e, id, d) {
    e.original.preventDefault();
    this.fire('chosen', id, _.find(this.get('items'), {id: id}));
  },
  computed: {
    languages: function() {
      return dashboard.get('languages');
    }
  },
  close: function() {
    drawers.close(this);
  }
});
