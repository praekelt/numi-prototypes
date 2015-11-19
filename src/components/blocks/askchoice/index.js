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
  onChoiceKeyDown(i) {
    if (i < this.get('allChoices').length - 1) return;
    this.addChoice();
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
    text: '',
    saveAs: null,
    routing: null
  };
}


module.exports = AskChoice;
