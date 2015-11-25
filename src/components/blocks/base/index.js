var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var drawers = require('../../../drawers');

var Base = Ractive.extend({
  destroy: function() {
    this.get('dialogue').deselectBlock(
      this.get('nodeId'),
      this.get('id'));

    this.get('sequence').removeBlock(this.get('id'));
  },
  drawerEdit: true,
  edit: function() {
    var view = this.getEditView();
    if (this.drawerEdit) drawers.change(view);
    else drawers.close();
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
  isComplete: function() {
    return true;
  },
  computed: {
    dialogue: function() {
      return this.parent.parent.parent;
    },
    sequence: function() {
      return this.parent;
    },
    isComplete: function() {
      return this.isComplete();
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
