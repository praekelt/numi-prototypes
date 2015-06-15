var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../../pg');
var BlockLibrary = require('../../../views/block-library');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {blocks: []};
  },
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    pg.push(library.el);
  },
  components: {
    ask: require('../../blocks/ask'),
    choice: require('../../blocks/choice')
  }
});
