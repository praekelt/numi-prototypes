var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {collections: []};
  }
});
