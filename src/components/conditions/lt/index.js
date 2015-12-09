var Comparison = require('../comparison');


var Lt = Comparison.extend({
  data: function() {
    return {operator: '<'};
  }
});


Lt.Edit = Comparison.extend();


module.exports = Lt;
