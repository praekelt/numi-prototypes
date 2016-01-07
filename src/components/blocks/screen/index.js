var Base = require('../base');
var proxyBlock = Base.proxyBlock;


var Screen = Base.extend({
  data: {
    highCharCount: 140
  },
  computed: {
    charCount: function() {
      return 0;
    },
    charCountIsHigh: function() {
      return this.get('charCount') > this.get('highCharCount');
    }
  }
});


Screen.Edit = Base.Edit.extend({
  computed: {
    charCount: proxyBlock('charCount'),
    charCountIsHigh: proxyBlock('charCountIsHigh')
  }
});


Screen.Stats = Base.Stats.extend();


module.exports = Screen;
