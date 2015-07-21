var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseChannel = require('../../../views/choose-channel');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseChannel: function() {
    var channels = ChooseChannel({el: $('<div>')});
    channels.set('source', this);
    pg.push(channels);
  },
});
