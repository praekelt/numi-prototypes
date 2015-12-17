var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Ractive = require('ractive');
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
      publishCount: 0,
      values: [],
      labels: [],
      languages: [this.newLanguage('English')],
      dialogues: [],
      channels: [{
        id: 'chan1',
        name: '*120*123#',
        available: true,
        isSessionBased: true
      }, {
        id: 'chan2',
        name: '*120*456#',
        available: true,
        isSessionBased: true
      }, {
        id: 'chan3',
        name: '*120*789#',
        available: true,
        isSessionBased: true
      }, {
        id: 'chan4',
        name: '12345',
        available: true,
        isSessionBased: false
      }, {
        id: 'chan5',
        name: '6789',
        available: true,
        isSessionBased: false
      }, {
        id: 'chan6',
        name: '0123',
        available: true,
        isSessionBased: false
      }]
    };
  },
  newLanguage: function(name) {
    return {
      id: uuid.v4(),
      name: name
    };
  },
  publish: function() {
    this.get('dialogueViews')
      .forEach(function(dialogue) {
        dialogue.publish();
      });

    this.add('publishCount');
    this.update();
  },
  confirmPublish: function() {
    var self = this;

    bootbox.confirm({
      message: [
        "Making changes live is irreversable. ",
        "Are you sure you would like to continue?"
      ].join(' '),
      callback: function(result) {
        if (result) self.publish();
      }
    });
  },
  takeChannel: function(id) {
    var i = _.findIndex(this.get('channels'), {id: id});
    this.set('channels.' + i + '.available', false);
  },
  releaseChannel: function(id) {
    var i = _.findIndex(this.get('channels'), {id: id});
    this.set('channels.' + i + '.available', true);
  },
  createDialogue: function() {
    drawers.open(NewDialogue({
      el: $('<div>'),
      data: {dashboard: this}
    }));
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
  getLanguageName: function(id) {
    return this.findWhere('languages', {id: id}).name;
  },
  computed: {
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
    },
    isComplete: function() {
      return _.all(_.invoke(this.get('dialogueViews'), 'isComplete'));
    },
    canPublish: function() {
      return this.get('hasUnpublishedChanges')
          && this.get('isComplete');
    },
  },
  getUserFields: function() {
    return [{
      id: 'msisdn',
      name: 'msisdn',
      special: true
    }]
    .concat(_(this.get('dialogues'))
        .pluck('sequences')
        .flatten()
        .pluck('blocks')
        .flatten()
        .pluck('saveAs')
        .compact()
        .map(function(v) {
          return {
            id: v,
            name: v
          };
        })
        .value());
  },
  getUserFieldName: function(id) {
    return _.find(this.getUserFields(), {id: id}).name;
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
  }
});
