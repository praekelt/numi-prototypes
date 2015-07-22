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
    placeholder = ['[', placeholder.name, ']'].join('');
    source.set('text', [source.get('text'), placeholder].join(' '));
    pg.pop();
  }
});


ContentLibrary.placeholders = [{
  name: 'Show next nine months',
  helptext: 'A numbered list of the next 9 months of the year, excluding the current month.',
  exampletext: ['1. August',
                '2. September',
                '3. October',
                '4. November',
                '5. December',
                '6. January',
                '7. February',
                '8. March',
                '9. April'
                ]
}, {
  name: 'Days of the week',
  helptext: 'A numbered list of the days of the week.',
  exampletext: ['1. Monday',
                '2. Tuesday',
                '3. Wednesday',
                '4. Thursday',
                '5. Friday',
                '6. Saturday',
                '7. Sunday']
}];


module.exports = ContentLibrary;
