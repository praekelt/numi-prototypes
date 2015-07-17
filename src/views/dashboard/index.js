var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var FilterEdit = require('../filter-edit');
var CollectionEdit = require('../collection-edit');
var NewCollection = require('../new-collection');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      filterViews: [],
      collectionViews: []
    };
  },
  addFilter: function(name) {
    var filter = FilterEdit({
      el: $('<div>'),
      data: {
        id: _.uniqueId('filter'),
        name: name
      }
    });

    this.push('filterViews', filter);
    return filter;
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
  newCollection: function() {
    var newColl = NewCollection({el: $('<div>')});
    pg.pop();
    pg.push(newColl.el);
  },
  computed: {
    filter: function() {
      return this.get('filterViews')
        .map(function(c) {
          return {
            id: c.get('id'),
            name: c.get('name')
          };
        });
    },
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
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();
  },
});
