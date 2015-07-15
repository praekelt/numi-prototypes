var Ractive = require('ractive');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function()  {
    return {
      channels: [
        {name: '*120*123#'},
        {name: '*120*124#'},
        {name: '*120*780#'},
        {name: '123456'},
        {name: '@motherlinker'}
      ]
    };
  },
  computed: {
    collection: function() {
      var screen = this.get('source');
      if (!screen) return null;

      return {
        id: screen.parent.get('id'),
        name: screen.parent.get('name')
      };
    }
  },
  choose: function(channel) {
    this.get('source').set('channel', channel);
    pg.pop();
  }
});
