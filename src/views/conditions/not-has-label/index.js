var Base = require('../base');
var Chooser = require('../../drawers/chooser');


var NotHasLabel = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {label: null};
  },
  chooseLabel: function(name) {
    var self = this;

    var chooser = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a label',
        items: dashboard.getUserLabels()
      }
    });

    chooser.once('chosen', function(id, d) {
      self.set('label', d.name);
      chooser.close();
    });

    chooser.open();
  }
});


NotHasLabel.isComplete = function(d) {
  return !!d.label;
};


NotHasLabel.Preview = Base.Preview.extend({
  template: require('./preview.html')
});


module.exports = NotHasLabel;
