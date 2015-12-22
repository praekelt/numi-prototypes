var drawers = require('../../drawers');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  setAsParent: function(id) {
    dashboard.setAsParentLanguage(id);
    this.updateLanguages();
  },
  addLanguage: function() {
    dashboard.addLanguage('');
    this.updateLanguages();
  },
  data: function() {
    return {languages: dashboard.get('languages')};
  },
  updateLanguages: function() {
    // TODO figure out why computed language that returns dashboard's languages
    // won't work, and why dashboard.update('languages') is not enough.
    this.set('languages', dashboard.get('languages'));
  },
  onchange: function(d) {
    dashboard.set('languages', this.get('languages'));
  },
  close: function() {
    drawers.close(this);
  }
});
