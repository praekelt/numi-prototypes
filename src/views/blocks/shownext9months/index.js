var Screen = require('../screen');
var blockUtils = require('../utils');
var utils = require('../../../utils');
var drawers = require('../../../drawers');
var Chooser = require('../../drawers/chooser');


var NextNMonths = Screen.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      saveAs: '',
      monthsAfter: 9
    };
  },
  computed: {
    charCount: function() {
      return [this.get('text')]
        .concat(this.exampleMonths)
        .join('\n')
        .length;
    },
    hasNonAsciiChars: function() {
      return utils.isNonAscii(this.get('text'));
    },
    text: blockUtils.contentProp('text'),
    textParent: blockUtils.contentPropGetter('text', 'parent'),
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


NextNMonths.Edit = Screen.Edit.extend({
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
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


NextNMonths.Stats = Screen.Stats.extend();


module.exports = NextNMonths;
