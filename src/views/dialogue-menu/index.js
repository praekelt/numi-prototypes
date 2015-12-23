var drawers = require('../../drawers');
var Ractive = require('ractive');
var ManageLanguages = require('../manage-languages');
var ChooseLanguage = require('../choose-language');


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
    var self = this;

    var chooser = ChooseLanguage({
      el: $('<div>'),
      data: {showParent: false}
    });

    chooser.once('chosen', function(languageId) {
      self.get('dialogue').showLanguage(languageId);
      drawers.close(chooser);
      drawers.close(self);
    });

    drawers.open(chooser);
  }
});
