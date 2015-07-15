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
  choose: function(collection) {
    this.get('source').set('collection', collection);
    pg.pop();
  },
  newCollection: function() {
    var newColl = NewCollection({el: $('<div>')});
    pg.pop();
    pg.push(newColl.el);
  }
});
