var Ractive = require('ractive');


var Base = Ractive.extend({
  data: function() {
    return {id: null};
  },
  isComplete: function() {
    return true;
  },
  computed: {
    isComplete: function() {
      return this.isComplete();
    }
  }
});


module.exports = Base;
