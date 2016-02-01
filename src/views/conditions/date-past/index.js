var Base = require('../base');
var Chooser = require('../../drawers/chooser');


var DatePast = Base.extend({
  template: require('./template.html'),
  computed: {
    fieldName: function() {
      return this.get('fieldId')
        ? dashboard.getUserFieldName(this.get('fieldId'))
        : null;
    }
  },
  chooseField: function(name) {
    var self = this;

    var chooser = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    chooser.once('chosen', function(id) {
      self.set('fieldId', id);
      chooser.close();
    });

    chooser.open();
  }
});


DatePast.isComplete = function(d) {
  return !!d.fieldId;
};


DatePast.Preview = Base.Preview.extend({
  template: require('./preview.html'),
  computed: DatePast.prototype.computed
});


module.exports = DatePast;
