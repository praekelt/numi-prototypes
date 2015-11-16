var $ = require('jquery');
var Interaction = require('../interaction');


module.exports = Interaction.extend({
  template: require('./template.html'),
  showEditModal() {
    $(this.el).find('.nm-modal-edit').modal('show');
  },
  showTab(e, to) {
    e.original.preventDefault();
    $(this.el).find('.nm-modal-edit a[href="#' + to + '"]').tab('show');
    return false;
  },
  addChoice() {
    this.push('allChoices', newChoice());
  },
  onChoiceKeyDown(i) {
    if (i < this.get('allChoices').length - 1) return;
    this.addChoice();
  },
  data: function() {
    return {
      text: '',
      allChoices: [newChoice()]
    };
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
    }
  }
});


function newChoice() {
  return {
    text: '',
    routing: null
  };
}
