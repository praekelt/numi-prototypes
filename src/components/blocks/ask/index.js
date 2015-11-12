var Interaction = require('../interaction');


module.exports = Interaction.extend({
  template: require('./template.html'),
  onconfig: function() {
    this.set(_.defaults(this.get(), {
      text: ''
    }));
  }
});
