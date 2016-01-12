var Screen = require('../screen');
var blockUtils = require('../utils');
var utils = require('../../../utils');
var drawers = require('../../../drawers');
var Chooser = require('../../drawers/chooser');


var Ask = Screen.extend({
  template: require('./preview.html'),
  computed: {
    charCount: function() {
      return this.get('text').length;
    },
    invalidCharCount: function() {
      return this.get('invalidInputText').length;
    },
    invalidCharCountIsHigh: function() {
      return this.get('invalidCharCount') > this.get('highCharCount');
    },
    hasNonAsciiChars: function() {
      return utils.isNonAscii(this.get('text'));
    },
    invalidHasNonAsciiChars: function() {
      return utils.isNonAscii(this.get('invalidInputText'));
    },
    text: blockUtils.contentProp('text'),
    textParent: blockUtils.contentPropGetter('text', 'parent'),
    invalidInputText: blockUtils.contentProp('invalidInputText'),
    invalidInputTextParent: blockUtils.contentPropGetter('invalidInputText', 'parent'),
  },
  data: function() {
    return {
      saveAs: 'Clinic Code'
    };
  },
  isComplete: function() {
    return this.get('text')
        && this.get('saveAs');
  }
});


Ask.Edit = Screen.Edit.extend({
  template: require('./edit.html'),
  computed: {
    invalidCharCount: blockUtils.proxyProp(
      'block', 'invalidCharCount'),
    invalidCharCountIsHigh: blockUtils.proxyProp(
      'block', 'invalidCharCountIsHigh'),
    invalidHasNonAsciiChars: blockUtils.proxyProp(
      'block', 'invalidHasNonAsciiChars'),
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
  },
  insertUserFieldInvalid: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id, d) {
      self.set(
        'invalidInputText',
        self.get('invalidInputText') + ' [' + d.name + ']');

      drawers.close(list);
    });

    drawers.open(list);
  }
});


Ask.Stats = Screen.Stats.extend();


module.exports = Ask;
