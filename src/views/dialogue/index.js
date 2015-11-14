var $ = require('jquery');
var BlockLibrary = require('../block-library');
var Ractive = require('ractive');
var hist = require('../../hist');
var pg = require('../../pg');


module.exports = Ractive.extend({
  template: require('./template.html'),
  partials: {blocks: require('./blocks.html')},
  data: function() {
    return {
      _prev: hist.pop(),
      blocks: []
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
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    library.set('dialogueView', this);
    pg.push(library);
  },
  previewEvent: function() {
    return 'To be overriden';
  },
  components: {
    ask: require('../../components/blocks/ask'),
    choice: require('../../components/blocks/choice'),
    end: require('../../components/blocks/end'),
    send: require('../../components/blocks/send'),
    saveas: require('../../components/blocks/saveas'),
    lbl: require('../../components/blocks/label'),
    rmlbl: require('../../components/blocks/rmlabel'),
    userdialsin: require('../../components/blocks/userdialsin'),
    usersendsmessage: require('../../components/blocks/usersendsmessage'),
    scheduled: require('../../components/blocks/scheduled'),
    manual: require('../../components/blocks/manual'),
    validatecliniccode: require('../../components/blocks/validatecliniccode'),
    shownext9months: require('../../components/blocks/shownext9months'),
    standardmessageset: require('../../components/blocks/standardmessageset'),
    latermessageset: require('../../components/blocks/latermessageset'),
    acceleratedmessageset: require('../../components/blocks/acceleratedmessageset'),
    calcweeks: require('../../components/blocks/calcweeks'),
    filter: require('../../components/blocks/filter')
  }
});
