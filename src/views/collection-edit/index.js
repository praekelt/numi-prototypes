var _ = require('lodash');
var BlockLibrary = require('../block-library');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {blockSets: []};
  },
  addScreen: function() {
    this.push('blockSets', {type: 'screen'});
  },
  previewEvent: function() {
    var event = _.chain(this.findAllComponents())
      .filter(function(c) {
        return c.get('type') == 'screen';
      })
      .map(function(c) {
        return c.findAllComponents();
      })
      .flatten()
      .find(function(c) {
        return BlockLibrary.isEvent(c.get('type'));
      })
      .value();

    console.log(event);
    return event
      ? event.preview() || ''
      : '';
  },
  components: {
    screen: require('../../components/blocksets/screen'),
    filter: require('../../components/blocksets/filter')
  }
});
