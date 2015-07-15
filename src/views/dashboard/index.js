var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var CollectionEdit = require('../collection-edit');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {collectionViews: []};
  },
  addCollection: function(name) {
    var coll = CollectionEdit({
      el: $('<div>'),
      data: {
        id: _.uniqueId('collection'),
        name: name
      }
    });

    this.push('collectionViews', coll);
    return coll;
  },
  computed: {
    collections: function() {
      return this.get('collectionViews')
        .map(function(c) {
          return {
            id: c.get('id'),
            name: c.get('name'),
            eventPreview: c.previewEvent()
          };
        });
    }
  }
});
