var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    dialogue: function() {
      var screen = this.get('source');
      if (!screen) return null;

      return {
        id: screen.parent.get('id'),
        name: screen.parent.get('name')
      };
    },
    dialogues: function() {
      return dashboard.get('dialogues');
    }
  },
  setChoice: function(dialogue) {
    this.get('source').set(this.get('fieldName') || 'dialogue', dialogue);
  },
  choose: function(dialogue) {
    this.setChoice(dialogue);
    pg.pop();
  },
  newDialogue: function() {
    // TODO
  }
});
