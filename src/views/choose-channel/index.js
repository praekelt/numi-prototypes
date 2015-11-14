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
      return this.get('source').get('collection').get();
    }
  },
  choose: function(channel) {
    this.get('source').set('channel', channel);
    pg.pop();
  }
});
