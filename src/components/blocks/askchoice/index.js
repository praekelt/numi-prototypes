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
  addChoice() {
    this.push('choices', newChoice());
  },
  onChoiceKeyDown(i) {
    if (i < this.get('choices').length - 1) return;
    this.addChoice();
  },
  data: function() {
    return {
      text: '',
      choices: [newChoice()],
      blocks: []
    };
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
