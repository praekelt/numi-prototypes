var uuid = require('node-uuid');
var Ractive = require('ractive');


var Base = Ractive.extend({
  data: function() {
    return {id: uuid.v4()};
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
    return this.constructor.isComplete(this.get());
  }
});


Base.isComplete = function() {
  return true;
};


Base.Preview = Ractive.extend();


module.exports = Base;
