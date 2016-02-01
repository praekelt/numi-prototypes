var Base = require('../base');
var Chooser = require('../../drawers/chooser');


var HasLabel = Base.extend({
  template: require('./template.html'),
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


HasLabel.isComplete = function(d) {
  return !!d.label;
};


HasLabel.Preview = Base.Preview.extend({
  template: require('./preview.html')
});


module.exports = HasLabel;
