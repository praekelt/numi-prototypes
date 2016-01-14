var d3 = require('d3');
var vis = require('./vis');
var data = require('./data');
var Ractive = require('ractive');


var Overview = Ractive.extend({
  template: require('./template.html'),
  oncomplete: function() {
    d3.select(this.el)
      .select('.nm-vis')
      .datum(data.parse(this.get()))
      .call(vis.draw);
  },
  computed: {
    campaignName: function() {
      return dashboard.get('campaignName');
    }
  }
});


module.exports = Overview;
