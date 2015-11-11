var $ = require('jquery');
var pg = require('../../../pg');
var Base = require('../base');
var ContentLibrary = require('../../../views/content-library');


var Interaction = Base.extend({
  data: function() {
    return {
      text: '',
      mode: 'edit'
    };
  },
});


var InteractionEdit = Base.Edit.extend({
  addContent: function() {
    var library = ContentLibrary({el: $('<div>')});
    library.set('source', this);
    library.set('collectionView', this.parent.parent);
    pg.push(library);
  }
});


var InteractionPreview = Base.Preview.extend({
});


Interaction.Edit = InteractionEdit;
Interaction.Preview = InteractionPreview;
module.exports = Interaction;
