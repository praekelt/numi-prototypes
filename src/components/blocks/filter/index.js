var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseFilter = require('../../../views/choose-filter');
var BlockLibrary = require('../../../views/block-library');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      blocks: []
    };
  },
  chooseFilter: function() {
    var filters = ChooseFilter({
      el: $('<div>'),
      data: {
        source: this,
        parent: {
          type: 'dialogues',
          id: this.parent.get('id'),
          name: this.parent.get('name')
        }
      }
    });

    pg.push(filters);
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
  }
});
