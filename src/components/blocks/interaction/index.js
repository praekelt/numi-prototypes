var $ = require('jquery');
var pg = require('../../../pg');
var Base = require('../base');
var ContentLibrary = require('../../../views/content-library');


module.exports = Base.extend({
  addContent: function() {
    var library = ContentLibrary({el: $('<div>')});
    library.set('source', this);
    library.set('dialogueView', this.parent.parent);
    pg.push(library);
  }
});
