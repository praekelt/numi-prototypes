var Base = require('../base');


var Annotation = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: ''
    };
  },
  isComplete: function() {
    return this.get('text');
  }
});


Annotation.Edit = Base.Edit.extend({
  template: require('./edit.html')
});


module.exports = Annotation;
