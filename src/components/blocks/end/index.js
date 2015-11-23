var Base = require('../base');


var Ask = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
    };
  }
});


Ask.Edit = Base.Edit.extend({
  template: require('./edit.html')
});


module.exports = Ask;
