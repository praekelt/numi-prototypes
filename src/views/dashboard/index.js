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
      values: [],
      labels: [],
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
    pg.push(newColl);
  },
  updateValue: function(oldVal, newVal) {
    var i = this.get('values').indexOf(oldVal);
    if (i < 0) this.push('values', newVal);
    else this.splice('values', i, 1, newVal);
  },
  updateLabel: function(oldLabel, newLabel) {
    var i = this.get('labels').indexOf(oldLabel);
    if (i < 0) this.push('labels', newLabel);
    else this.splice('labels', i, 1, newLabel);
  },
  computed: {
    filters: function() {
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
