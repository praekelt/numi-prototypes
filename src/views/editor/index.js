var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  updateContent: function(e) {
    this.set('content', $(e.original.target).text());
  },
  oncomplete: function() {
  }
});
