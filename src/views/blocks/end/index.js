var Base = require('../base');
var Screen = require('../screen');
var drawers = require('../../../drawers');
var Chooser = require('../../drawers/chooser');
var newContentProp = Base.newContentProp;
var newRoContentProp = Base.newRoContentProp;


var End = Screen.extend({
  template: require('./preview.html'),
  computed: {
    charCount: function() {
      return this.get('text').length;
    },
    text: newContentProp('text'),
    textParent: newRoContentProp('text', 'parent')
  },
  isComplete: function() {
    return this.get('text');
  }
});


End.Edit = Screen.Edit.extend({
  template: require('./edit.html'),
  insertUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


End.Stats = Screen.Stats.extend();


module.exports = End;
