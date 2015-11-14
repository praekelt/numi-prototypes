var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseDialogue = require('../../../views/choose-dialogue');
var ChooseValue = require('../../../views/choose-value');


module.exports = Base.extend({
  template: require('./template.html'),
  choosePassDialogue: function() {
    var colls = ChooseDialogue({el: $('<div>')});
    colls.set('source', this);
    colls.set('fieldName', 'passDialogue');
    colls.set('onlyLinked', true);
    pg.push(colls);
  },
  chooseFailDialogue: function() {
    var colls = ChooseDialogue({el: $('<div>')});
    colls.set('source', this);
    colls.set('fieldName', 'failDialogue');
    colls.set('onlyLinked', true);
    pg.push(colls);
  },
  chooseValue: function() {
    pg.push(ChooseValue({
      el: $('<div>'),
      data: {
        source: this,
        parent: {
          type: 'dialogues',
          id: this.parent.get('id'),
          name: this.parent.get('name')
        }
      }
    }));
  }
});
