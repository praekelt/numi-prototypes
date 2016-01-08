var Base = require('../base');
var utils = require('../../../utils');
var proxyProp = require('../utils').proxyProp;


var Screen = Base.extend({
  data: {
    charParser: charParser,
    highCharCount: 140
  },
  computed: {
    charCount: function() {
      return 0;
    },
    charCountIsHigh: function() {
      return this.get('charCount') > this.get('highCharCount');
    },
    hasNonAsciiChars: function() {
      return false;
    }
  }
});


Screen.Edit = Base.Edit.extend({
  computed: {
    charCount: proxyProp('block', 'charCount'),
    charCountIsHigh: proxyProp('block', 'charCountIsHigh'),
    hasNonAsciiChars: proxyProp('block', 'hasNonAsciiChars')
  }
});


function charParser(c) {
  return utils.isNonAscii(c)
    ? ['nm-char-nonascii']
    : [];
}


Screen.Stats = Base.Stats.extend();


module.exports = Screen;
