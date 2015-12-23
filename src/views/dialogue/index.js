var $ = require('jquery');
var _ = require('lodash');
var moment = require('moment');
var uuid = require('node-uuid');
var Ractive = require('ractive');
var hist = require('../../hist');
var seqtree = require('../../seqtree');
var drawers = require('../../drawers');
var DialogueMenu = require('../dialogue-menu');
var ChooseLanguage = require('../choose-language');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      silent: null,
      sequences: [],
      shownLanguageId: null,
      shownLanguageName: null,
      publishCount: 0,
      lastEdit: newDate(),
      hasUnpublishedChanges: false,
      _prev: hist.pop()
    };
  },
  oninit: function() {
    var self = this;

    dashboard.observe('languages', function() {
      self.refreshShownLanguage();
    });

    this.refreshShownLanguage();
  },
  showMenu: function() {
    drawers.open(DialogueMenu({
      el: $('<div>'),
      data: {dialogue: this}
    }), {isThin: true});
  },
  selectBlockItem: function(nodeId, seqId, blockId, itemId) {
    var root = this.get('seqtree');
    var node = seqtree.find(root, nodeId);
    seqtree.select(node, [seqId, blockId, itemId]);
    this.set('seqtree', root);
  },
  deselectBlock: function(nodeId, blockId) {
    var root = this.get('seqtree');
    var node = seqtree.find(root, nodeId);

    if (seqtree.isOnBlock(node, blockId)) {
      seqtree.deselect(node);
      this.set('seqtree', root);
    }
  },
  onchange: function(props) {
    if ('silent' in props) return;

    this.set({
      silent: null,
      lastEdit: newDate(),
      hasUnpublishedChanges: true
    });
  },
  oncomplete: function() {
    hist.push(this);

    $(this.el)
      .find('.nm-rename')
      .hide();

    $(this.el)
      .find('.sortable-blocks')
      .sortable();

    $('.nm-body')
      .mousewheel(function(e, delta) {
        if ($(e.target).parents('.nm-sequence').length) return;
        this.scrollLeft -= delta * 30;
      });
  },
  publish: function() {
    this.set({
      silent: true,
      publishCount: this.get('publishCount') + 1,
      hasUnpublishedChanges: false
    });
  },
  addSequence: function(name) {
    var seq ={
      id: uuid.v4(),
      name: name || 'Sequence ' + this.get('sequences').length,
      blocks: [],
    };

    this.push('sequences', seq);
    return seq;
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
  isComplete: function() {
    return _.chain(this.get('sequences'))
      .pluck('blocks')
      .flatten()
      .invoke('isComplete')
      .all()
      .value();
  },
  refreshShownLanguage: function() {
    var id = this.get('shownLanguageId');
    if (!id) return;
    var lang = dashboard.findWhere('languages', {id: id});
    if (!lang) this.setShownLanguage(null);
    else this.setShownLanguage(id);
  },
  getCurrentLanguageId: function() {
    var id = this.get('shownLanguageId');

    return !id
      ? this.getParentLanguageId()
      : id;
  },
  getParentLanguageId: function() {
    return dashboard.findWhere('languages', {isParent: true}).id;
  },
  changeLanguage: function() {
    var self = this;

    var chooser = ChooseLanguage({
      el: $('<div>'),
      data: {showParent: false}
    });

    chooser.once('chosen', function(languageId) {
      self.showLanguage(languageId);
      drawers.close(chooser);
    });

    drawers.open(chooser);
  },
  hideLanguage: function() {
    this.setShownLanguage(null);
  },
  showLanguage: function(languageId) {
    this.setShownLanguage(languageId);
  },
  setShownLanguage: function(id) {
    var name = null;
    if (id) name = dashboard.getLanguageName(id);
    this.set('shownLanguageId', id);
    this.set('shownLanguageName', name);
  },
  components: {
    seqsurrogate: require('../seqsurrogate')
  },
  computed: {
    campaignName: function() {
      return dashboard.get('campaignName');
    },
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
    },
    isComplete: function() {
      return this.get('isComplete');
    },
    sequenceChain: function() {
      var results = [];
      var node = this.get('seqtree');
      var seq;

      while (node) {
        seq = _.find(this.get('sequences'), {id: node.key[0]});

        _.extend(_.last(results), {
          activeBlockId: node.key[1],
          activeBlockItemId: node.key[2]
        });

        results.push(_.extend({}, seq, {nodeId: node.id}));
        node = node.children[node.currentIdx];
      }

      return results;
    }
  }
});


function newDate() {
  return moment().format("ddd, MMM D YYYY, h:mm a");
}
