var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../pg');
var hist = require('../../hist');
var ConditionLibrary = require('../condition-library');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {conditions: []};
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
    hist.push(this);
  },
  computed: {
    href: function() {
      return ['/numi-prototypes/filters', this.get('id'), 'edit'].join('/');
    },
    histName: function() {
      return ['filter', this.get('name')].join(' ');
    },
    prev: function() {
      return hist.pop();
    }
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
    eq: require('../../components/conditions/eq'),
    gt: require('../../components/conditions/gt'),
    gte: require('../../components/conditions/gte'),
    lt: require('../../components/conditions/lt'),
    lte: require('../../components/conditions/lte'),
    has: require('../../components/conditions/has'),
    nothas: require('../../components/conditions/nothas'),
    filter: require('../../components/conditions/filter')
  }
});
