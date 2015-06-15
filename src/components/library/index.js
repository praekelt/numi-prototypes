var Ractive = require('ractive');
var pg = require('../../pg');


// TODO something similar to this for filters
module.exports = Ractive.extend({
  template: require('./template.html'),
  addBlock: function(type) {
    this.get('source').push('blocks', {type: type});
    pg.pop();
  }
});
