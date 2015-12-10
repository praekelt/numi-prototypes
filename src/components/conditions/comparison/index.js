var Base = require('../base');


var Comparison = Base.extend({
  template: require('./preview.html'),
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


Comparison.Edit = Base.Edit.extend({
  template: require('./edit.html')
});


module.exports = Comparison;
