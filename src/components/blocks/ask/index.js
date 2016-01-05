var Base = require('../base');
var drawers = require('../../../drawers');
var Chooser = require('../../../views/chooser');
var newContentProp = Base.newContentProp;
var newRoContentProp = Base.newRoContentProp;


var Ask = Base.extend({
  template: require('./preview.html'),
  computed: {
    text: newContentProp('text'),
    textParent: newRoContentProp('text', 'parent')
  },
  data: function() {
    return {saveAs: ''};
  },
  isComplete: function() {
    return this.get('text');
  }
});


Ask.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  oncomplete: function() {
  },
  computed: {
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  },
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


Ask.Stats = Base.Stats.extend();


module.exports = Ask;
