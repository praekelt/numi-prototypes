var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseLabel = require('../../../views/choose-label');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {label: ''}
  },
  chooseLabel: function() {
    var labels = ChooseLabel({
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

    pg.push(labels);
  }
});
