var Ractive = require('ractive');
var pg = require('../../pg');


var ContentLibrary = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {placeholders: ContentLibrary.placeholders};
  },
  computed: {
    collection: function() {
      var collection = this.get('collectionView');
      if (!collection) return null;

      return {
        id: collection.get('id'),
        name: collection.get('name')
      };
    }
  },
  addPlaceholder: function(placeholder) {
    var source = this.get('source');
    placeholder = ['[', placeholder, ']'].join('');
    source.set('text', [source.get('text'), placeholder].join(' '));
    pg.pop();
  }
});


ContentLibrary.placeholders = [
  'Show next nine months'
];


module.exports = ContentLibrary;
