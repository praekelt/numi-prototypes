var d3 = require('d3');
var data = require('./data');
var vis = require('./vis');
var store = require('./store');
var Ractive = require('ractive');


var Overview = Ractive.extend({
  template: require('./template.html'),
  onconfig: function() {
    this._d = data.parse(this.get());
  },
  oncomplete: function() {
    d3.select(this.el)
      .select('.nm-vis')
      .datum(this._d)
      .call(vis.draw);
  },
  refresh: function() {
    this.update('hasSelection');
  },
  showSelected: function() {
    var seqtree = this.get('seqtree');
    store.applyToSeqtree(this._d, seqtree, this.get('sequences'));
    this.fire('showPath', seqtree);
  },
  computed: {
    hasSelection: function() {
      return store.isSelected(this._d);
    },
    campaignName: function() {
      return dashboard.get('campaignName');
    }
  }
});


module.exports = Overview;
