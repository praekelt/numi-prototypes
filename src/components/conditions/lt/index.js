var Comparison = require('../comparison');


var Lt = Comparison.extend({
  data: function() {
    return {operator: '<'};
  }
});


module.exports = Lt;
