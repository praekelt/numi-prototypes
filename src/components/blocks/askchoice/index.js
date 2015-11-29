var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Base = require('../base');
var drawers = require('../../../drawers');
var ChooseSequence = require('../../../views/choose-sequence');
var Chooser = require('../../../views/chooser');


var AskChoice = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: '',
      allChoices: [newChoice()],

      getSequenceName: function(id) {
        var seq = _.find(this.get('dialogue').get('sequences'), {id: id});
        return seq
          ? seq.name
          : '';
      }
    };
  },
  isComplete: function() {
    return this.get('text')
        && this.get('allChoices').length > 1;
  },
  selectChoice(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    this.selectItem(choice.route, id);
  },
  onChoiceClick(e, id) {
    e.original.preventDefault();
    this.selectChoice(id);
  },
  computed: {
    choices: function() {
      return (this.get('allChoices') || []).slice(0, -1);
    }
  }
});


AskChoice.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  showTab(e, to) {
    e.original.preventDefault();
    $(this.el).find('a[href="#' + to + '"]').tab('show');
    return false;
  },
  addChoice() {
    this.push('allChoices', newChoice());
  },
  onChoiceKeyDown(i) {
    if (i < this.get('allChoices').length - 1) return;
    this.addChoice();
  },
  removeRoute: function(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    choice.route = null;
    this.update('allChoices');
  },
  onRouteClick: function(e, id) {
    e.original.preventDefault();
    this.get('block').selectChoice(id);
  },
  setRoute: function(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    var self = this;

    var chooser = ChooseSequence({
      el: $('<div>'),
      data: {dialogue: this.get('dialogue')}
    });

    chooser.once('chosen', function(seqId) {
      choice.route = seqId;
      self.update();
      self.get('block').selectItem(seqId, id);
    });

    drawers.open(chooser);
  },
  data: {
    getSequenceName: function(id) {
      return _.find(this
        .get('dialogue')
        .get('sequences'), {id: id})
        .name;
    }
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
    },
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  },
  insertUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


AskChoice.Stats = Base.Stats.extend();


function newChoice() {
  return {
    id: uuid.v4(),
    text: '',
    saveAs: null,
    route: null
  };
}


module.exports = AskChoice;
