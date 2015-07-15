var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    collections: function() {
      return this.get('collectionViews')
        .map(function(c) {
          return {
            id: c.get('id'),
            name: c.get('name'),
            eventPreview: c.previewEvent()
          };
        });
    }
  }
});
