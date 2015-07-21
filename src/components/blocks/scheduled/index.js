var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var BlockLibrary = require('../../../views/block-library');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      frequency: 1,
      interval: 'days',
      blocks: []
    };
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();
  },
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    pg.push(library);
  },
  destroy: function() {
    this.parent.parent.set('schedule', null);
    $(this.el).remove();
  }
});
