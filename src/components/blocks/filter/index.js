var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseFilter = require('../../../views/choose-filter');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      screen: {}
    };
  },
  chooseFilter: function() {
    var filters = ChooseFilter({
      el: $('<div>'),
      data: {
        source: this,
        parent: {
          type: 'collections',
          id: this.parent.get('id'),
          name: this.parent.get('name')
        }
      }
    });

    pg.push(filters);
  },
  components: {
    screen: require('../../blocksets/screen')
  }
});
