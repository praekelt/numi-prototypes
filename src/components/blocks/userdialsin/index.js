var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseChannel = require('../../../views/choose-channel');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {channel: null};
  },
  chooseChannel: function() {
    var channels = ChooseChannel({el: $('<div>')});
    channels.set('source', this);
    pg.push(chann);
  },
  preview: function() {
    return this.get('channel')
      ? "When the user dials in on " + this.get('channel')
      : null;
  }
});
