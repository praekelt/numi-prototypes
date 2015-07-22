var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseCollection = require('../../../views/choose-collection');


module.exports = Base.extend({
  template: require('./template.html'),
  choosePassCollection: function() {
    var colls = ChooseCollection({el: $('<div>')});
    colls.set('source', this);
    colls.set('fieldName', 'passCollection');
    colls.set('onlyLinked', true);
    pg.push(colls);
  },
  chooseFailCollection: function() {
    var colls = ChooseCollection({el: $('<div>')});
    colls.set('source', this);
    colls.set('fieldName', 'failCollection');
    colls.set('onlyLinked', true);
    pg.push(colls);
  }
});
