var Base = require('../base');
var drawers = require('../../../drawers');
var Chooser = require('../../../views/chooser');


var Ask = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: 'Clinic Code'
    };
  },
  isComplete: function() {
    return this.get('text')
        && this.get('saveAs');
  }
});


Ask.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  },
  onchange: function(d) {
    if (d.saveAs) dashboard.update('dialogues');
  },
  insertUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  },
  insertUserFieldInvalid: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id, d) {
      self.set('invalidInputText', self.get('invalidInputText') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


module.exports = Ask;
