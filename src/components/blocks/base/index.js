var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var drawers = require('../../../drawers');

var Base = Ractive.extend({
  destroy: function() {
    var seq = this.get('sequence');
    var blocks = seq.get('blocks');
    seq.set('blocks', _.reject(blocks, {id: this.get('id')}));
  },
  edit: function() {
    var self = this;

    var edit = this.constructor.Edit({
      el: $('<div>'),
      data: this.get()
    });

    edit.on('change', function() { self.set(edit.get()); });
    drawers.open(edit);
  },
  computed: {
    dialogue: function() {
      return this.parent.parent;
    },
    sequence: function() {
      return this.parent.parent;
    }
  }
});


Base.Edit = Ractive.extend({
  close: function() {
    drawers.close();
  }
});


module.exports = Base;
