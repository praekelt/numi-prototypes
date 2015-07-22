var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var NewCollection = require('../new-collection');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    collection: function() {
      var screen = this.get('source');
      if (!screen) return null;

      return {
        id: screen.parent.get('id'),
        name: screen.parent.get('name')
      };
    },
    collections: function() {
      return dashboard.get('collections');
    }
  },
  setChoice: function(collection) {
    this.get('source').set(this.get('fieldName') || 'collection', collection);
  },
  choose: function(collection) {
    this.setChoice(collection);
    pg.pop();
  },
  newCollection: function() {
    var newColl = NewCollection({el: $('<div>')});
    newColl.set('chooser', this);
    newColl.set('onlyLinked', !!this.get('onlyLinked'));
    pg.pop();
    pg.push(newColl);
  }
});
