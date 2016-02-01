var Chooser = require('../chooser');
var Base = require('../base');


module.exports = Base.extend({
  template: require('./template.html'),
  addSequence: function() {
    var seq = this.get('dialogue').addSequence(this.get('newSequenceName'));
    this.choose(seq.id);
    this.back();
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
      self.choose(id);
      self.close();
      list.close();
    });

    list.open();
  },
  chooseDialogue: function() {
  },
  choose: function(id) {
    this.fire('chosen', id);
  }
});
