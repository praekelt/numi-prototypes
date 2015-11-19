var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Base = require('../base');


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
  onChoiceClick(e, seqId, id) {
    e.original.preventDefault();

    this.get('dialogue').selectBlockItem(
      this.get('nodeId'),
      seqId,
      this.get('id'),
      id);
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
  setRoute: function(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    // TODO choose route
    choice.route = this.get('dialogue').addSequence().id;
    this.update();
  },
  data: {
    getSequenceName: function(id) {
      return _.find(this.get('dialogue').get('sequences'), {id: id}).name;
    }
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
    },
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  }
});


function newChoice() {
  return {
    id: uuid.v4(),
    text: '',
    saveAs: null,
    route: null
  };
}


module.exports = AskChoice;
