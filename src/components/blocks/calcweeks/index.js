var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseCollection = require('../../../views/choose-collection');
var ChooseValue = require('../../../views/choose-value');


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
  },
  chooseValue: function() {
    pg.push(ChooseValue({
      el: $('<div>'),
      data: {
        source: this,
        parent: {
          type: 'collections',
          id: this.parent.get('id'),
          name: this.parent.get('name')
        },
        fieldName: 'inputValue'
      }
    }));
  }
});
