var Base = require('../base');


var SetLabel = Base.extend({
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


SetLabel.Edit = Base.Edit.extend({
  template: require('./edit.html')
});


module.exports = SetLabel;
