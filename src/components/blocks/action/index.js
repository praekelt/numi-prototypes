var _ = require('lodash');
var Base = require('../base');
var Chooser = require('../../../views/chooser');
var drawers = require('../../../drawers');


var Action = Base.extend({
  template: require('./preview.html')
});


Action.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    parsedFields: function() {
      var userFields = dashboard.get('userFields');

      return this.get('fields')
        .map(function(d) {
          return {
            key: d.key,
            name: d.name,
            userField: d.userFieldId
              ? _.find(userFields, {id: d.userFieldId})
              : null
          };
        });
    }
  },
  choose: function(key) {
    var self = this;
    var i = _.findIndex(this.get('fields'), {key: key});

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field for ' + this.get('fields.' + i).name,
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id) {
      self.set('fields.' + i + '.userFieldId', id);
      drawers.close(list);
    });

    drawers.open(list);
  },
  remove: function(key) {
    var i = _.findIndex(this.get('fields'), {key: key});
    this.set('fields.' + i + '.userFieldId', null);
  }
});


module.exports = Action;
