var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  destroy: function() {
    var coll = this.parent.parent;
    var blocks = coll.get('blocks');
    coll.set('blocks', _.reject(blocks, {id: this.get('id')}));
  },
  save: function() {
    this.set('mode', 'preview');
  },
  edit: function() {
    this.set('mode', 'edit');
  },
  onEdit: function(e) {
    this.edit();
    e.original.stopPropagation();
  },
  onrender: function() {
    var self = this;

    $(self.el).click(function(e) {
      e.stopPropagation();
    });

    $('body').click(function(e) {
      if (self.get('mode') == 'edit') self.save();
    });
  }
});
