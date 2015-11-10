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
    };
  },
  addFilter: function(name) {
    var d = {
      id: _.uniqueId('filter'),
      name: name
    };

    this.push('filters', d);
    return this.findFilterView(d.id);
  },
  addCollection: function(name, type) {
    var d = {
      id: _.uniqueId('collection'),
      name: name,
      type: type
    };

    this.push('collections', d);
    return this.findCollectionView(d.id);
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
    filterViews: function() {
      return this.get('filters')
        .map(function(d) {
          return new FilterEdit({
            el: $('<div>'),
            data: d
          });
        });
    },
    collectionViews: function() {
      return this.get('collections')
        .map(function(d) {
          return collectionTypes[d.type]({
            el: $('<div>'),
            data: d
          });
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
  },
  findCollectionView: function(id) {
    return _.find(this.get('collectionViews'), function(c) {
      return c.get('id') === id;
    });
  },
  findFilterView: function(id) {
    return _.find(this.get('filterViews'), function(c) {
      return c.get('id') === id;
    });
  }
});
