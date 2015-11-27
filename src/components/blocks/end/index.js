var Base = require('../base');
var drawers = require('../../../drawers');
var Chooser = require('../../../views/chooser');


var Ask = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
    };
  },
  isComplete: function() {
    return this.get('text');
  }
});


Ask.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  insertUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


Ask.Stats = Base.Stats.extend();


module.exports = Ask;
