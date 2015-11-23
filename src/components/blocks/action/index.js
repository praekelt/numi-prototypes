var _ = require('lodash');
var Base = require('../base');
var Chooser = require('../../../views/chooser');
var drawers = require('../../../drawers');


var Action = Base.extend({
  template: require('./preview.html')
});


Action.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  choose: function(key) {
    var self = this;
    var i = _.findIndex(this.get('fields'), {key: key});
    console.log(i);

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field for ' + this.get('fields.' + i).name,
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id) {
      self.set('fields.' + i + '.userField', id);
      drawers.close(list);
    });

    drawers.open(list);
  },
  remove: function(key) {
    var i = _.findIndex(this.get('fields'), {key: key});
    this.set('fields.' + i + '.userField', null);
  }
});


module.exports = Action;
