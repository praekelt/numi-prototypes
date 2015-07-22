var $ = require('jquery');
var BlockLibrary = require('../../../views/block-library');
var Ractive = require('ractive');
var hist = require('../../../hist');
var pg = require('../../../pg');


module.exports = Ractive.extend({
  data: function() {
    return {
      _prev: hist.pop(),
      blocks: []
    };
  },
  computed: {
    href: function() {
      return ['/numi-prototypes/collections', this.get('id'), 'edit'].join('/');
    },
    histName: function() {
      return ['collection', this.get('name')].join(' ');
    },
    prev: function() {
      return this.get('_prev');
    },
    backHref: function() {
      return this.get('_prev')
        ? this.get('_prev').href
        : '/numi-prototypes/'
    }
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
    hist.push(this);
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();
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
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    library.set('collectionView', this);
    pg.push(library);
  },
  previewEvent: function() {
    return 'To be overriden';
  }
});
