var d3 = require('d3');
var vis = require('./vis');
var Ractive = require('ractive');


var Overview = Ractive.extend({
  template: require('./template.html'),
  onrender: function() {
    d3.select(this.el)
      .select('.nm-vis')
      .datum('TODO')
      .call(vis.draw);
  },
  computed: {
    campaignName: function() {
      return dashboard.get('campaignName');
    }
  }
});


module.exports = Overview;
