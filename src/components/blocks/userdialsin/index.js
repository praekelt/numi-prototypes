var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseChannel = require('../../../views/choose-channel');


var UserDialsInEdit = Base.Edit.extend({
  template: require('./edit.html'),
  data: function() {
    return {channel: null};
  },
  chooseChannel: function() {
    var channels = ChooseChannel({el: $('<div>')});
    channels.set('source', this);
    pg.push(channels);
  },
  preview: function() {
    return this.get('channel')
      ? "When the user dials in on " + this.get('channel')
      : null;
  }
});


var UserDialsInPreview = Base.Preview.extend({
});


var UserDialsIn = Base.extend({
  components: {
    edit: UserDialsInEdit,
    preview: UserDialsInPreview
  }
});


UserDialsIn.Edit = UserDialsInEdit;
UserDialsIn.Preview = UserDialsInPreview;
module.exports = UserDialsIn;
