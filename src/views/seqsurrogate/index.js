var Ractive = require('ractive');
var _ = require('lodash');


module.exports = Ractive.extend({
  template: require('./template.html'),
  components: {
    sequence: require('../sequence')
  },
  onchange: function() {
    var sequences = this.parent.get('sequences');
    var i = _.indexOf(sequences, {id: this.get('id')});

    var d = _.omit(this.get(), 'activeBlockId', 'activeBlockItemId');
    this.parent.set('sequences.' + i, d);
  }
});
