var _ = require('lodash');
var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseChannel = require('../../../views/choose-channel');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseChannel: function() {
    pg.push(ChooseChannel({
      el: $('<div>'),
      data: {source: this}
    }));
  },
  previewEvent: function() {
    return this.get('channel')
      ? "When the user dials in on " + this.get('channel')
      : null;
  },
  oninit: function() {
    var self = this;

    this.on('blockAdded', function() {
      var blocks = self.findAllComponents()
        .filter(function(c) {
          return c.get('type') == 'send';
        });

      blocks
        .forEach(function(c) {
          c.set('isSessionLast', false);
        });

      _.last(blocks).set('isSessionLast', true);
    });
  }
});
