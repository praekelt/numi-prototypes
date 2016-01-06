var drawers = require('../../drawers');
var Drawer = require('../drawer');
var ManageLanguages = require('../manage-languages');
var ChooseLanguage = require('../choose-language');


module.exports = Drawer.extend({
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
  changeCampaign: function() {
  },
  manageLanguages: function() {
    drawers.open(ManageLanguages({el: $('<div>')}));
  },
  showLanguage: function() {
    var self = this;

    var chooser = ChooseLanguage({
      el: $('<div>'),
      data: {showParent: false}
    });

    chooser.once('chosen', function(languageId) {
      self.get('dialogue').showLanguage(languageId);
      self.close();
    });

    drawers.open(chooser);
  }
});
