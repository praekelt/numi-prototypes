var _ = require('lodash');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  destroy: function() {
    var coll = this.parent.parent;
    var blocks = coll.get('blocks');
    coll.set('blocks', _.reject(blocks, {id: this.get('id')}));
  },
  data: function() {
    return {
      mode: 'edit'
    };
  }
});
