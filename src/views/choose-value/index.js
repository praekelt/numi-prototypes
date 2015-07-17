var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    values: function() {
      return dashboard.get('values');
    }
  },
  setChoice: function(value) {
    this.get('source').set(this.get('fieldName') || 'value', value);
  },
  choose: function(value) {
    this.setChoice(value);
    pg.pop();
  }
});
