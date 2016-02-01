var _ = require('lodash');
var Base = require('../base');
var ChooseOperand = require('../../drawers/choose-operand');
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
  preview: function(name) {
    var d = this.get(name);

    if (d.type === 'userField' && d.userFieldId != null)
      return dashboard.getUserFieldName(d.userFieldId);
    else if (d.type === 'value')
      return d.value;
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
        return this.preview(name);
      }
    };
  },
  computed: {
    operandSpan: function() {
      return Math.floor((21 - this.get('operatorSpan')) / 2);
    }
  }
});


Comparison.isComplete = function(d) {
  return d.a != null
      && d.b != null;
};


Comparison.Preview = Base.Preview.extend({
  template: require('./preview.html'),
  preview: Comparison.prototype.preview,
  computed: {
    previewA: function() {
      return this.preview('a');
    },
    previewB: function() {
      return this.preview('b');
    }
  }
});


module.exports = Comparison;
