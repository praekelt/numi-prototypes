var _ = require('lodash');
var Base = require('../base');
var ChooseOperand = require('../../../views/choose-operand');
var drawers = require('../../../drawers');


var Comparison = Base.extend({
  template: require('./template.html'),
  chooseOperand: function(name) {
    var self = this;

    var chooser = ChooseOperand({
      el: $('<div>'),
      data: _.extend({dataType: this.get('dataType')}, this.get(name))
    });

    chooser.on('change', function() {
      self.set(name, chooser.get());
    });

    drawers.open(chooser);
  },
  isComplete: function() {
    return this.get('a') != null
        && this.get('b') != null;
  },
  data: function() {
    return {
      a: null,
      b: null,
      dataType: null,
      operator: null,
      operatorSpan: 1,
      exists: function(name) {
        return this.get(name) != null;
      },
      preview: function(name) {
        var d = this.get(name);

        if (d.type === 'userField' && d.userFieldId != null)
          return dashboard.getUserFieldName(d.userFieldId);
        else if (d.type === 'value')
          return d.value;
      }
    };
  },
  computed: {
    operandSpan: function() {
      return Math.floor((21 - this.get('operatorSpan')) / 2);
    }
  }
});


module.exports = Comparison;
