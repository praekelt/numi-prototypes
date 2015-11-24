var _ = require('lodash');
var Base = require('../base');
var Chooser = require('../../../views/chooser');
var drawers = require('../../../drawers');


var Edd = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      inputFieldId: null,
      saveAs: ''
    };
  }
});


Edd.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    inputFieldName: function() {
      return this.get('inputFieldId')
        ? _
        .find(dashboard.get('userFields'), {id: this.get('inputFieldId')})
        .name
        : null;
    },
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  },
  choose: function(id) {
    if (id) return;
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id) {
      self.set('inputFieldId', id);
      drawers.close(list);
    });

    drawers.open(list);
  },
  remove: function() {
    this.set('inputFieldId', null);
  }
});


module.exports = Edd;
