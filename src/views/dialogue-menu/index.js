var drawers = require('../../drawers');
var Ractive = require('ractive');
var ManageLanguages = require('../manage-languages');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {languages: dashboard.get('languages')};
  },
  oncomplete: function() {
    $('.nm-menu-actions').on('click', function(e) { e.preventDefault(); });
  },
  oninit: function() {
    var self = this;
    dashboard.observe('languages', function() {
      self.set('languages', dashboard.get('languages'));
    });
  },
  close: function() {
    drawers.close(this);
  },
  changeCampaign: function() {
  },
  manageLanguages: function() {
    drawers.open(ManageLanguages({el: $('<div>')}));
  },
  showLanguage: function() {
  }
});
