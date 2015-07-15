var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../../pg');
var ChooseChannel = require('../../../views/choose-channel');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {channel: null};
  },
  chooseChannel: function() {
    var channels = ChooseChannel({el: $('<div>')});
    channels.set('source', this);
    pg.push(channels.el);
  },
  preview: function() {
    return "When the user dials in on " + this.get('channel');
  }
});
