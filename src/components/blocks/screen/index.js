var Base = require('../base');


var Screen = Base.extend();


Screen.Edit = Base.Edit.extend({
  data: {
    charCount: 0,
    highCharCount: 140
  },
  computed: {
    charCountIsHigh: function() {
      return this.get('charCount') > this.get('highCharCount');
    }
  }
});


Screen.Stats = Base.Stats.extend();


module.exports = Screen;
