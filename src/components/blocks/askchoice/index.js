var $ = require('jquery');
var uuid = require('node-uuid');
var Interaction = require('../interaction');


module.exports = Interaction.extend({
  template: require('./template.html'),
  partials: {blocks: require('./blocks.html')},
  addBlock: function() {
    this.push('blocks', {
      id: uuid.v4(),
      type: 'routing' // TODO choosable
    });
  },
  showEditModal() {
    $(this.el).find('.nm-modal-edit').modal('show');
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
      allChoices: [newChoice()],
      blocks: []
    };
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
    }
  },
  components: {
    routing: require('./blocks/routing')
  }
});


function newChoice() {
  return {
    text: '',
    routing: null
  };
}
