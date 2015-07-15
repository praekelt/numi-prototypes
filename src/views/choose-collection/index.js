var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {
      collections: dashboard.get('collections')
    };
  },
  choose: function(collection) {
    this.get('source').set('collection', collection);
    pg.pop();
  }
});
