var _ = require('lodash');
var Base = require('../base');
var Chooser = require('../../drawers/chooser');


var Action = Base.extend({
  template: require('./preview.html'),
  isComplete: function() {
    return _.all(_.pluck(this.get('fields'), 'userFieldId'));
  }
});


Action.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    parsedFields: function() {
      var userFields = dashboard.getUserFields();

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
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id) {
      self.set('fields.' + i + '.userFieldId', id);
      list.close();
    });

    list.open();
  },
  remove: function(key) {
    var i = _.findIndex(this.get('fields'), {key: key});
    this.set('fields.' + i + '.userFieldId', null);
  }
});


module.exports = Action;
