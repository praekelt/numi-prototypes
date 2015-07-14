var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {collectionViews: []};
  },
  computed: {
    collections: function() {
      return this.get('collectionViews')
        .map(function(coll) {
          return {
            id: coll.get('id'),
            name: coll.get('name')
          };
        });
    }
  }
});
