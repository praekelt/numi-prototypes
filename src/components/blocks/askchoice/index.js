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
  data: function() {
    return {
      text: '',
      choices: [],
      blocks: []
    };
  },
  components: {
    routing: require('./blocks/routing')
  }
});
