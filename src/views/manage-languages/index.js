var Drawer = require('../drawer');


module.exports = Drawer.extend({
  template: require('./template.html'),
  setAsParent: function(id) {
    dashboard.setAsParentLanguage(id);
    this.updateLanguages();
  },
  addLanguage: function() {
    dashboard.addLanguage('');
    this.updateLanguages();
    this.focusNewLanguage();
  },
  data: function() {
    return {languages: dashboard.get('languages')};
  },
  focusNewLanguage: function() {
    $(this.el)
      .find('.nm-lang-name')
      .last()
      .focus();
  },
  updateLanguages: function() {
    // TODO figure out why computed language that returns dashboard's languages
    // won't work, and why dashboard.update('languages') is not enough.
    this.set('languages', dashboard.get('languages'));
  },
  onchange: function(d) {
    dashboard.set('languages', this.get('languages'));
  }
});
