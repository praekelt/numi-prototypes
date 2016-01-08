var Base = require('../base');
var proxyProp = require('../utils').proxyProp;


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
    charCount: proxyProp('block', 'charCount'),
    charCountIsHigh: proxyProp('block', 'charCountIsHigh')
  }
});


Screen.Stats = Base.Stats.extend();


module.exports = Screen;
