var _ = require('lodash');
var Base = require('../base');
var Chooser = require('../../../views/chooser');
var drawers = require('../../../drawers');


var UserDialsIn = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      channelIds: []
    };
  },
  computed: {
    channels: function() {
      return dashboard
        .get('channels')
        .filter(function(d) {
          return this.get('channelIds').indexOf(d.id) > -1;
        }, this);
    }
  }
});


UserDialsIn.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    channels: function() {
      return dashboard
        .get('channels')
        .filter(function(d) {
          return this.get('channelIds').indexOf(d.id) > -1;
        }, this);
    }
  },
  oncomplete: function() {
    if (!this.get('channelIds').length) {
      drawers.close(this);
      this.choose();
    }
  },
  getChooser: function() {
    return Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a channel',
        items: dashboard.get('channels')
          .filter(function(d) {
            return d.available
                && d.isSessionBased;
          })
      }
    });
  },
  choose: function() {
    var self = this;
    var list = this.getChooser();

    list.once('chosen', function(id) {
      dashboard.takeChannel(id);
      self.push('channelIds', id);
      drawers.close(list);
    });

    this.update();
    drawers.open(list);
  },
  remove: function(id) {
    var i = _.findIndex(this.get('channelIds'), id);
    this.splice('channelIds', i, 1);
    dashboard.releaseChannel(id);
    this.update();
  },
  onChooseClick: function(e) {
    e.original.preventDefault();
    this.choose();
  }
});


module.exports = UserDialsIn;
