var $ = require('jquery');
var Base = require('../base');
var ChooseCollection = require('../../../views/choose-collection');
var pg = require('../../../pg');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseCollection: function() {
    var colls = ChooseCollection({el: $('<div>')});
    colls.set('source', this);
    pg.push(colls.el);
  }
});
