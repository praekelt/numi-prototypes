var Base = require('../base');


var Comparison = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      a: null,
      b: null,
      exists: function(name) {
        return this.get(name) != null;
      },
      preview: function(name) {
      }
    };
  },
  isComplete: function() {
    return this.get('a') != null
        && this.get('b') != null;
  }
});


module.exports = Comparison;
