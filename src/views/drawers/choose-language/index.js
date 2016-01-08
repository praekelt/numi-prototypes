var _ = require('lodash');
var Base = require('../base');
var ManageLanguages = require('../manage-languages');
var drawers = require('../../../drawers');


module.exports = Base.extend({
  template: require('./template.html'),
  choose: function(e, id) {
    e.original.preventDefault();
    this.fire('chosen', id, _.find(this.get('items'), {id: id}));
  },
  manage: function(e) {
    e.original.preventDefault();
    var self = this;

    var languages = ManageLanguages({el: $('<div>')});
    drawers.open(languages);

    languages.on('change', function() {
      self.set('languages', languages.get('languages'));
    });
  },
  data: function() {
    return {
      showParent: true,
      languages: dashboard.get('languages')
    };
  }
});
