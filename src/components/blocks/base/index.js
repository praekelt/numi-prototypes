var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  destroy: function() {
    var coll = this.get('collection');
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
  onBodyClick: function() {
    if (this.get('mode') == 'edit') this.save();
  },
  onClick: function(e) {
    e.stopPropagation();
  },
  onrender: function() {
    $(this.el)
      .on('click', this.onClick = this.onClick.bind(this));

    $(this.get('collection').el)
      .on('click', this.onBodyClick = this.onBodyClick.bind(this));
  },
  onunrender: function() {
    $(this.el)
      .unbind('click', this.onClick);

    $(this.get('collection').el)
      .unbind('click', this.onBodyClick);
  },
  computed: {
    collection: function() {
      return this.parent;
    }
  }
});
