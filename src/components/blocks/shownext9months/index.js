var Base = require('../base');
var drawers = require('../../../drawers');
var Chooser = require('../../../views/chooser');


var NextNMonths = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: '',
      monthsAfter: 9
    };
  },
  computed: {
    exampleMonths: function() {
      return [
        "Nov",
        "Dec",
        "Jan '16",
        "Feb '16",
        "Mar '16",
        "Apr '16",
        "May '16",
        "Jun '16",
        "Jul '16",
        "Aug '16",
        "Sep '16",
        "Oct '16",
        "Nov '16",
        "Dec '16"
      ].slice(0, this.get('monthsAfter'));
    }
  },
  isComplete: function() {
    return this.get('text')
        && this.get('saveAs');
  }
});


NextNMonths.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
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
  }
});


module.exports = NextNMonths;
