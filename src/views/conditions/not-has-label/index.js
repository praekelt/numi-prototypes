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
  },
  isComplete: function() {
    return !!this.get('label');
  }
});


module.exports = HasLabel;
