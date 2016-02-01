var drawers = require('../../../drawers');
var Chooser = require('../chooser');
var Base = require('../base');


var ChooseOperand = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      type: 'value',
      value: 0,
      userFieldId: null
    };
  },
  onconfig: function() {
    if (this.get('dataType') === 'text') this.set('value', '');
  },
  computed: {
    userFieldName: function() {
      return dashboard.getUserFieldName(this.get('userFieldId'));
    }
  },
  chooseUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id) {
      self.set({
        type: 'userField',
        userFieldId: id
      });

      self.done();
      drawers.close();
    });

    drawers.open(list);
  },
  done: function() {
    this.fire('chosen', {
      type: this.get('type'),
      userFieldId: this.get('userFieldId'),
      value: this.get('value')
    });
  },
  close: function() {
    drawers.close(this);
  }
});


module.exports = ChooseOperand;
