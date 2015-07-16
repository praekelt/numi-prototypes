var $ = require('jquery');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  destroy: function() {
    $(this.el).remove();
  }
});
