var $ = require('jquery');
var drawers = require('../../drawers');
var BlockLibrary = require('../drawers/block-library');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  partials: {blocks: require('./blocks.html')},
  data: function() {
    return {
      blocks: []
    };
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
  },
  rename: function() {
    this.set('nameBackup', this.get('name'));
    $(this.find('.nm-name')).hide();
    $(this.find('.nm-rename')).show();
  },
  hideRename: function() {
    $(this.find('.nm-rename')).hide();
    $(this.find('.nm-name')).show();
  },
  cancelRename: function() {
    this.set('name', this.get('nameBackup'));
    this.hideRename();
  },
  addBlock: function() {
    var self = this;
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    drawers.change(library);

    this.once('blockAdded', function(d) {
      self.scrollToBlock(d.id);
      self.editBlock(d.id);
    });
  },
  scrollToBlock: function(id) {
    $(this.el)
      .find('.nm-sequence-body')
      .scrollTo('.nm-block-wrapper[data-id="' + id + '"]');
  },
  editBlock: function(id) {
    $(this.el)
      .find('.nm-block-wrapper[data-id="' + id + '"] .nm-block-edit')
      .click();
  },
  removeBlock: function(id) {
    this.removeWhere('blocks', {id: id});
  },
  components: require('../blocks')
});
