var $ = require('jquery');
var Base = require('../base');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {label: ''}
  },
  oninit: function() {
    var self = this;

    this.on('labelChange', function(e) {
      var oldLabel = this.get('label');
      var newLabel = $(e.node).val();
      this.set('label', newLabel);
      dashboard.updateLabel(oldLabel, newLabel);
    });
  }
});
