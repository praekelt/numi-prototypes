var Base = require('../base');


var Comparison = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      a: null,
      b: null,
      preview: function(name) {
        if (!this.get(name)) return '_';
      }
    };
  }
});


Comparison.Edit = Base.Edit.extend({
  template: require('./edit.html')
});


module.exports = Comparison;
