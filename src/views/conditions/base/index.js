var Ractive = require('ractive');


var Base = Ractive.extend({
  data: function() {
    return {id: null};
  },
  computed: {
    isComplete: function() {
      return this.isComplete();
    }
  },
  destroy: function() {
    this.parent.removeCondition(this.get('id'));
  },
  isComplete: function() {
    return true;
  },
});


module.exports = Base;