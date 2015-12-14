var Base = require('../base');
var Chooser = require('../../../views/chooser');
var drawers = require('../../../drawers');


var Comparison = Base.extend({
  template: require('./template.html'),
  chooseField: function(name) {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id) {
      self.set(name, id);
      drawers.close();
    });

    drawers.open(list);
  },
  data: function() {
    return {
      a: null,
      b: null,
      dataType: null,
      operator: null,
      exists: function(name) {
        return this.get(name) != null;
      },
      preview: function(name) {
        return dashboard.getUserFieldName(this.get(name));
      }
    };
  },
  isComplete: function() {
    return this.get('a') != null
        && this.get('b') != null;
  }
});


module.exports = Comparison;
