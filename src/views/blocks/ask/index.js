var Screen = require('../screen');
var utils = require('../../../utils');
var drawers = require('../../../drawers');
var Chooser = require('../../drawers/chooser');


var Ask = Screen.extend({
  template: require('./preview.html'),
  computed: {
    charCount: function() {
      return this.get('text').length;
    },
    text: utils.contentProp('text'),
    textParent: utils.contentProp('text', 'parent')
  },
  data: function() {
    return {saveAs: ''};
  },
  isComplete: function() {
    return this.get('text');
  }
});


Ask.Edit = Screen.Edit.extend({
  template: require('./edit.html'),
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


Ask.Stats = Screen.Stats.extend();


module.exports = Ask;
