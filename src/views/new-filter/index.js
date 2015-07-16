var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {filters: dashboard.get('filters')};
  },
  save: function() {
    var filter = dashboard.addFilter(this.get('name'));
    pg.pop();
    pg.push(filter.el);
  }
});
