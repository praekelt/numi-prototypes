var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseDialogue = require('../../../views/choose-dialogue');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseDialogue: function() {
    var colls = ChooseDialogue({el: $('<div>')});
    colls.set('source', this);
    pg.push(colls);
  }
});
