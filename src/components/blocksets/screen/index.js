var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var BlockLibrary = require('../../../views/block-library');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {blocks: []};
  },
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    if (this.parent.hasEvent && this.parent.hasEvent()) library.set('disableEvents', true);
    pg.push(library);
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();
  },
  components: {
    block: require('../../blocks/block')
  }
});
