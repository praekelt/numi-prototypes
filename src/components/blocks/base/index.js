var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var drawers = require('../../../drawers');

var Base = Ractive.extend({
  destroy: function() {
    this.get('sequence').removeBlock(this.get('id'));
  },
  edit: function() {
    drawers.change(this.getEditView());
  },
  getEditView: function() {
    var self = this;
    this.get('sequence').scrollToBlock(this.get('id'));

    var edit = this.constructor.Edit({
      el: $('<div>'),
      data: _.extend(this.get(), {
        block: this,
        dialogue: this.get('dialogue')
      })
    });

    edit.on('change', function() {
      self.set(_.omit(edit.get(), 'block', 'dialogue'));
    });

    return edit;
  },
  selectItem: function(seqId, itemId) {
    this.get('dialogue').selectBlockItem(
      this.get('nodeId'),
      seqId,
      this.get('id'),
      itemId);
  },
  computed: {
    dialogue: function() {
      return this.parent.parent.parent;
    },
    sequence: function() {
      return this.parent;
    }
  }
});


Base.Edit = Ractive.extend({
  close: function() {
    drawers.close(this);
  },
  destroy: function() {
    this.get('block').destroy();
    this.close();
  }
});


module.exports = Base;
