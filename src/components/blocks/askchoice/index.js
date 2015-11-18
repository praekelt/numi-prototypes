var $ = require('jquery');
var Base = require('../base');


var AskChoice = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: '',
      allChoices: [newChoice()]
    };
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
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
  setChoice(i, val) {
    this.set('allChoices.' + i + '.text', val);
  },
  onChoiceKeyDown(e, i) {
    if (i < this.get('allChoices').length - 1)
      this.setChoice(i, denum(i, $(e.original.target).val()));
    else
      this.addChoice();
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
    },
    choiceColSpan: function() {
      return 3 - this.get('useAnswerSaving');
    },
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  }
});


function denum(i, str) {
  return str.slice(('' + i).length + '. '.length);
}


function newChoice() {
  return {
    text: '',
    saveAs: null,
    routing: null
  };
}


module.exports = AskChoice;
