var pg = require('../../pg');
var drawers = require('../../drawers');
var page = require('page');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  create: function() {
    var dialogue = this.get('dashboard').addDialogue(this.get('name'));
    drawers.close(this);
    page('./#!/dialogues/' + dialogue.get('id'));
    pg.push(dialogue);
  },
  close: function() {
    drawers.close(this);
  }
});
