var Base = require('../base');


module.exports = Base.extend({
  template: require('./template.html'),
  previewEvent: function() {
    return "When starting this collection";
  }
});
