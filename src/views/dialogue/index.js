var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Ractive = require('ractive');
var hist = require('../../hist');
var seqtree = require('../../seqtree');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      sequences: [],
      _prev: hist.pop()
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
        node = node.current;
      }

      return results;
    }
  },
  selectBlockItem: function(nodeId, seqId, blockId, itemId) {
    var node = seqtree.find(this.get('seqtree'), nodeId);
    seqtree.select(node, [seqId, blockId, itemId]);
    this.update('seqtree');
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
    hist.push(this);
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();

    $('.nm-body')
      .mousewheel(function(e, delta) {
        if ($(e.target).parents('.nm-sequence').length) return;
        this.scrollLeft -= delta * 30;
      });
  },
  addSequence: function() {
    var seq ={
      id: uuid.v4(),
      name: 'Sequence ' + this.get('sequences').length,
      blocks: []
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
  components: {
    seqsurrogate: require('../seqsurrogate')
  }
});
