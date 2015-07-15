var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {
      collections: dashboard.get('collections')
    };
  },
  save: function(collection) {
    pg.pop();
    pg.push(dashboard.addCollection(this.get('name')).el);
  }
});
