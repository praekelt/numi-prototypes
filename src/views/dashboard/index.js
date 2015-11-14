var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var FilterEdit = require('../filter-edit');
var NewFilter = require('../new-filter');
var Dialogue = require('../dialogue');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      values: [],
      labels: [],
      filters: [],
      dialogues: []
    };
  },
  addFilter: function(name) {
    var d = {
      id: 'filter' + this.get('filters').length,
      name: name
    };

    this.push('filters', d);
    return this.findFilterView(d.id);
  },
  addDialogue: function(name, type) {
    var d = {
      id: 'dialogue' + this.get('dialogues').length,
      name: name,
      type: type
    };

    this.push('dialogues', d);
    return this.findDialogueView(d.id);
  },
  newDialogue: function() {
    var coll = this.addDialogue('', 'dialogue');
    pg.push(coll);
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
    dialogueViews: function() {
      return this.get('dialogues')
        .map(function(d) {
          return Dialogue({
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
  findDialogueView: function(id) {
    return _.find(this.get('dialogueViews'), function(c) {
      return c.get('id') === id;
    });
  },
  findFilterView: function(id) {
    return _.find(this.get('filterViews'), function(c) {
      return c.get('id') === id;
    });
  }
});
