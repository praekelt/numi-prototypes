var Base = require('../base');


var Ask = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: ''
    };
  }
});


Ask.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  }
});


module.exports = Ask;
