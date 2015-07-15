var $ = require('jquery');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {blockSets: []};
  },
  addScreen: function() {
    this.push('blockSets', {type: 'screen'});
  },
  components: {
    screen: require('../../components/blocksets/screen'),
    filter: require('../../components/blocksets/filter')
  }
});
