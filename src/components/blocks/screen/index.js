var Base = require('../base');
var proxyBlock = Base.proxyBlock;


var Screen = Base.extend({
  computed: {
    charCount: function() {
      return 0;
    },
    charCountIsHigh: function() {
      return this.get('charCount') > 140;
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
