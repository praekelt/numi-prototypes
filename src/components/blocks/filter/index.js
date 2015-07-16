var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseFilter = require('../../../views/choose-filter');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseFilter: function() {
    var filters = ChooseFilter({el: $('<div>')});
    filters.set('source', this);
    pg.push(filters.el);
  }
});
