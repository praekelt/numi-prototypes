var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseCollection = require('../../../views/choose-collection');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseCollection: function() {
    var colls = ChooseCollection({el: $('<div>')});
    colls.set('source', this);
    pg.push(colls.el);
  }
});
