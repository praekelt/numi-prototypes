var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {filters: dashboard.get('filters')};
  },
  save: function(filterection) {
    var filter = dashboard.addFilter(this.get('name'));

    if (this.get('chooser')) this.get('chooser').setChoice({
      id: filter.get('id'),
      name: filter.get('name')
    });

    pg.pop();
    pg.push(filter.el);
  }
});
