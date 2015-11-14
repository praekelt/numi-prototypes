var $ = require('jquery');
var Ractive = require('ractive');
var hist = require('../../hist');


module.exports = Ractive.extend({
  template: require('./template.html'),
  partials: {blocks: require('./blocks.html')},
  data: function() {
    return {
      _prev: hist.pop(),
      sequences: []
    };
  },
  computed: {
    href: function() {
      return ['/numi-prototypes/dialogues', this.get('id'), 'edit'].join('/');
    },
    histName: function() {
      return ['dialogue', this.get('name')].join(' ');
    },
    prev: function() {
      return this.get('_prev');
    },
    backHref: function() {
      return this.get('_prev')
        ? this.get('_prev').href
        : '/numi-prototypes/';
    }
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
    hist.push(this);
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();
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
  previewEvent: function() {
    return 'To be overriden';
  },
  components: {
    sequence: require('../sequence')
  }
});
