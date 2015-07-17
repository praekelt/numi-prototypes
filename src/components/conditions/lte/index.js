var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseValue = require('../../../views/choose-value');


module.exports = Base.extend({
  template: require('./template.html'),
  chooseValue: function() {
    var values = ChooseValue({
      el: $('<div>'),
      data: {
        source: this,
        parent: {
          type: 'filters',
          id: this.parent.get('id'),
          name: this.parent.get('name')
        }
      }
    });

    pg.push(values.el);
  }
});
