var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseCollection = require('../../../views/choose-collection');


module.exports = Base.extend({
  template: require('./template.html'),
  oninit: function() {
    var self = this;

    this.on('valueChange', function(e) {
      var oldVal = this.get('value');
      var newVal = $(e.node).val();
      this.set('value', newVal);
      dashboard.updateValue(oldVal, newVal);
    });
  }
});
