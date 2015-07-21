var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseFilter = require('../../../views/choose-filter');
var BlockLibrary = require('../../../views/block-library');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      frequency: 1,
      interval: 'day',
      sections: []
    };
  },
  chooseFilter: function() {
    pg.push(ChooseFilter({
      el: $('<div>'),
      data: {
        source: this,
        parent: {
          type: 'collections',
          id: this.get('id'),
          name: this.get('name')
        }
      }
    }));
  },
  addSection: function() {
    this.push('sections', []);
  },
  addBlock: function(sectionIdx) {
    var library = BlockLibrary({el: $('<div>')});
    library.set('key', 'sections.' + sectionIdx);
    library.set('source', this);
    library.set('collectionView', this);
    pg.push(library);
  },
  previewEvent: function() {
    return 'Every ' + this.get('frequency') + ' ' + this.get('interval') + 's';
  }
});
