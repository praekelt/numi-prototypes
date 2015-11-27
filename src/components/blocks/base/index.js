var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var drawers = require('../../../drawers');

var Base = Ractive.extend({
  numDatapoints: 50,
  randDatapoints: function(min, max) {
    return d3
      .range(this.numDatapoints)
      .map(d3.random.bates(10))
      .map(d3.scale.linear()
        .domain([0, 1])
        .range([min, max]))
      .map(Math.floor);
  },
  data: function() {
    var d = {};
    d._ = _;
    d.stats = {};
    d.formatValue = d3.format(',');

    d.stats.times = d3
      .range(this.numDatapoints)
      .map(function(d, i) { return +(new Date()) + (i * 1000); });

    d.stats.timeouts = this.randDatapoints(0, 1000);
    d.stats.answers = this.randDatapoints(0, 1000);
    d.stats.views = _.zip(d.stats.timeouts, d.stats.answers).map(_.sum);

    return d;
  },
  destroy: function() {
    this.get('dialogue').deselectBlock(
      this.get('nodeId'),
      this.get('id'));

    this.get('sequence').removeBlock(this.get('id'));
  },
  drawerEdit: true,
  edit: function() {
    var view = this.getEditView();
    if (this.drawerEdit) drawers.change(view);
    else drawers.close();
  },
  getEditView: function() {
    var self = this;
    this.get('sequence').scrollToBlock(this.get('id'));

    var edit = this.constructor.Edit({
      el: $('<div>'),
      data: _.extend(this.get(), {
        block: this,
        dialogue: this.get('dialogue')
      })
    });

    edit.on('change', function() {
      self.set(_.omit(edit.get(), 'block', 'dialogue'));
    });

    return edit;
  },
  selectItem: function(seqId, itemId) {
    this.get('dialogue').selectBlockItem(
      this.get('nodeId'),
      seqId,
      this.get('id'),
      itemId);
  },
  isComplete: function() {
    return true;
  },
  computed: {
    dialogue: function() {
      return this.parent.parent.parent;
    },
    sequence: function() {
      return this.parent;
    },
    isComplete: function() {
      return this.isComplete();
    }
  },
  showStats: function() {
    var stats = this.constructor.Stats({
      el: $('<div>'),
      data: this.get()
    });

    drawers.open(stats);
  }
});


Base.Edit = Ractive.extend({
  close: function() {
    drawers.close(this);
  },
  destroy: function() {
    this.get('block').destroy();
    this.close();
  }
});


Base.Stats = Ractive.extend({
  template: require('./stats.html'),
  close: function() {
    drawers.close(this);
  }
});


module.exports = Base;
