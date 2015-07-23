var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var FilterEdit = require('../filter-edit');
var collectionTypes = require('../../components/collections');
var NewCollection = require('../new-collection');
var NewFilter = require('../new-filter');
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
  addCollection: function(name, type) {
    var coll = collectionTypes[type]({
      el: $('<div>'),
      data: {
        id: _.uniqueId('collection'),
        name: name,
        type: type
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
  newFilter: function()  {
    var newFilter = NewFilter({el: $('<div>')});
    pg.pop();
    pg.push(newFilter);
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

    var availableTags = [
      "[next9months]",
      "[another placeholder]"
    ];

    $(this.el).find('.ask-text').autocomplete({
      source: availableTags
    });
    
  },
  destroy: function(collId) {
    $(this.el).find('#coll' + collId).remove();
  }
});
