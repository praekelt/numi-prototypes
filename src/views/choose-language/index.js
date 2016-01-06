var _ = require('lodash');
var Drawer = require('../../views/drawer');
var ManageLanguages = require('../manage-languages');


module.exports = Drawer.extend({
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
  },
  close: function() {
    drawers.close(this);
  }
});
