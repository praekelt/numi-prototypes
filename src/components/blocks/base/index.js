var _ = require('lodash');
var Ractive = require('ractive');


var Base = Ractive.extend({
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


var BaseEdit = Ractive.extend({
  destroy: function() {
    this.parent.destroy();
  }
});


var BasePreview = Ractive.extend({
  destroy: function() {
    this.parent.destroy();
  }
});


Base.Edit = BaseEdit;
Base.Preview = BasePreview;
module.exports = Base;
