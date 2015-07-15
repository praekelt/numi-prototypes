var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var NewCollection = require('../new-collection');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {
      collections: dashboard.get('collections')
    };
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
