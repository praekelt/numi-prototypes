var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Ractive = require('ractive');
var FilterEdit = require('../filter-edit');
var NewFilter = require('../new-filter');
var NewDialogue = require('../new-dialogue');
var Dialogue = require('../dialogue');
var pg = require('../../pg');
var drawers = require('../../drawers');
var seqtree = require('../../seqtree');
var bootbox = require('bootbox');


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
  publish: function() {
    this.get('dialogueViews')
      .forEach(function(dialogue) {
        dialogue.publish();
      });

    this.update();
  },
  confirmPublish: function() {
    var self = this;

    bootbox.confirm({
      message: [
        "Publishing is irreversable. ",
        "Are you sure you would like to publish?"
      ].join(' '),
      callback: function(result) {
        if (result) self.publish();
      }
    });
  },
  createDialogue: function() {
    drawers.open(NewDialogue({
      el: $('<div>'),
      data: {dashboard: this}
    }));
  },
  addFilter: function(name) {
    var d = {
      id: 'filter' + this.get('filters').length,
      name: name
    };

    this.push('filters', d);
    return this.findFilterView(d.id);
  },
  addDialogue: function(name) {
    var entrySeqId = uuid.v4();

    var d = {
      id: 'dialogue' + this.get('dialogues').length,
      name: name,
      sequences: [{
        id: entrySeqId,
        name: 'Start of ' + name,
        blocks: []
      }],
      seqtree: seqtree.create([entrySeqId, null, null])
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
    },
    hasUnpublishedChanges: function() {
      return _.any(_.pluck(this.get('dialogues'), 'hasUnpublishedChanges'));
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
