var Ractive = require('ractive');
var drawers = require('../../../drawers');


var Base = Ractive.extend({
  edit: function() {
    var view = this.getEditView();
    if (this.drawerEdit) drawers.change(view);
    else drawers.close();
  },
  getEditView: function() {
    var self = this;

    var edit = this.constructor.Edit({
      el: $('<div>'),
      data: _.extend(this.get(), {condition: this})
    });

    edit.on('change', function() {
      self.set(_.omit(edit.get(), 'condition'));
    });

    return edit;
  }
});


Base.Edit = Ractive.extend({
  close: function() {
    drawers.close(this);
  },
  destroy: function() {
    this.get('condition').destroy();
    this.close();
  }
});


module.exports = Base;
