var Base = require('../base');


var AbLabel = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      a: '',
      b: ''
    };
  },
  isComplete: function() {
    return this.get('a') && this.get('b');
  }
});


AbLabel.Edit = Base.Edit.extend({
  template: require('./edit.html')
});


module.exports = AbLabel;
