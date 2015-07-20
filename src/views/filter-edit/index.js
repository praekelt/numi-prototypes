var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var ConditionLibrary = require('../condition-library');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {conditions: []};
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
  },
  rename: function() {
    this.set('nameBackup', this.get('name'));
    $(this.find('.nm-name')).hide();
    $(this.find('.nm-rename')).show();
  },
  hideRename: function() {
    $(this.find('.nm-rename')).hide();
    $(this.find('.nm-name')).show();
  },
  cancelRename: function() {
    this.set('name', this.get('nameBackup'));
    this.hideRename();
  },
  addCondition: function() {
    var library = ConditionLibrary({
      el: $('<div>'),
      data: {filter: this}
    });

    pg.push(library);
  },
  components: {
    lte: require('../../components/conditions/lte'),
    nothas: require('../../components/conditions/nothas'),
    filter: require('../../components/conditions/filter')
  }
});
