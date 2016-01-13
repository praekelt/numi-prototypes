var Ractive = require('ractive');


var Overview = Ractive.extend({
  template: require('./template.html'),
  computed: {
    campaignName: function() {
      return dashboard.get('campaignName');
    }
  }
});


module.exports = Overview;
