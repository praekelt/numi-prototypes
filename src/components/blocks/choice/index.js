var $ = require('jquery');
var Ractive = require('ractive');
var ChooseCollection = require('../../../views/choose-collection');
var pg = require('../../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  chooseCollection: function() {
    var colls = ChooseCollection({el: $('<div>')});
    colls.set('source', this);
    pg.push(colls.el);
  },
});
