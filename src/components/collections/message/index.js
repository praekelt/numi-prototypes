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
    return this.get('channel') && this.get('text')
      ? "When the user sends '" + this.get('text') + "' to " + this.get('channel')
      : null;
  }
});