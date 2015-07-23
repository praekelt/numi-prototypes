var Interaction = require('../interaction');


module.exports = Interaction.extend({
  template: require('./template.html'),
  data: function() {
    return {isSessionLast: false};
  }
});
