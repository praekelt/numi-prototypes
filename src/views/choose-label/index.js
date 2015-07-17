var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    labels: function() {
      return dashboard.get('labels');
    }
  },
  setChoice: function(label) {
    this.get('source').set(this.get('fieldName') || 'label', label);
  },
  choose: function(label) {
    this.setChoice(label);
    pg.pop();
  }
});
