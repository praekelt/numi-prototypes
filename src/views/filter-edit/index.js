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

    return event
      ? event.preview() || ''
      : '';
  }
});
