var $ = require('jquery');
var _ = require('lodash');
var BlockLibrary = require('../block-library');
var Ractive = require('ractive');
var hist = require('../../hist');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {blockSets: []};
  },
  computed: {
    href: function() {
      return ['/numi-prototypes/collections', this.get('id'), 'edit'].join('/');
    },
    histName: function() {
      return ['collection', this.get('name')].join(' ');
    },
    prev: function() {
      return hist.pop();
    }
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
    hist.push(this);
  },
  addScreen: function() {
    this.push('blockSets', {type: 'screen'});
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
    var event = _.chain(this.findAllComponents())
      .filter(function(c) {
        return c.get('type') == 'screen';
      })
      .map(function(c) {
        return c.findAllComponents();
      })
      .flatten()
      .find(function(c) {
        return BlockLibrary.isEvent(c.get('type'));
      })
      .value();

    return event && typeof event.preview == 'function'
      ? event.preview() || ''
      : '';
  },
  components: {
    screen: require('../../components/blocksets/screen')
  }
});
