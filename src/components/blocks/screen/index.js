var Base = require('../base');


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
  // We can't dynamically delegate to the relevant Screen's computed
  // properties, Ractive.js doesn't seem able to react to changes that way.
  // Instead, we borrow the properties.
  computed: Screen.prototype.computed
});


Screen.Stats = Base.Stats.extend();


module.exports = Screen;
