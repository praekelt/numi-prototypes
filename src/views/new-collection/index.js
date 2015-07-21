var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {
      collections: dashboard.get('collections')
    };
  },
  save: function() {
    var coll = dashboard.addCollection(this.get('name'), this.get('type'));

    if (this.get('chooser')) this.get('chooser').setChoice({
      id: coll.get('id'),
      name: coll.get('name')
    });

    pg.pop();
    pg.push(coll);
  }
});
