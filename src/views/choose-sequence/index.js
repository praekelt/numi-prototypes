var drawers = require('../../drawers');
var Chooser = require('../../views/chooser');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  addSequence: function() {
    var seq = this.get('dialogue').addSequence(this.get('newSequenceName'));
    this.choose(seq.id);
    drawers.close(this);
  },
  chooseSequence: function(e) {
    e.original.preventDefault();
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a sequence',
        items: this.get('dialogue').get('sequences')
      }
    });

    list.once('chosen', function(id) {
      this.choose(id);
      drawers.close(self);
      drawers.close(list);
    });

    drawers.open(list);
  },
  chooseDialogue: function() {
  },
  choose: function(id) {
    this.fire('chosen', id);
  },
  close: function() {
    drawers.close(this);
  }
});
