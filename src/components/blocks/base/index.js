var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var drawers = require('../../../drawers');
var sapphire = require('../../../../bower_components/sapphire/build/sapphire');

var numDatapoints = 50;

var times = d3
  .range(numDatapoints)
  .map(function(d, i) { return +(new Date()) + (i * 1000 * 60 * 60 * 8); });

var publishTimes = _.sample(times, 6);


var Base = Ractive.extend({
  numDatapoints: numDatapoints,
  randDatapoints: function(min, max) {
    return d3
      .range(numDatapoints)
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

    d.stats.times = times;
    d.stats.publishTimes = publishTimes;
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
  oncomplete: function() {
    this.draw();
  },
  draw: function() {
    this.drawTotalsChart();
  },
  appendPublishTimes(el) {
    var chart = el.select('.sph-chart');

    var fx = d3.time.scale()
      .domain(d3.extent(times))
      .range([0, 600]);

    chart
      .select('.sph-chart svg > g')
      .insert('g', '.sph-lines-metrics')
      .attr('transform', sapphire.utils.translate(0, 110))
      .selectAll('.nm-publish-time')
      .data(publishTimes).enter()
        .append('g')
          .attr('class', 'nm-publish-time')
          .attr('transform', function(x) {
            return sapphire.utils.translate(fx(x), 0);
          })
          .append('line')
            .attr('y2', -110)
            .attr('x2', 0);

      var table = el.select('.sph-table');
      var lastRow = table.select('tr:last-child');

      table.node()
        .appendChild(lastRow.node().cloneNode(true));

      lastRow = el.select('.sph-table tr:last-child');

      lastRow.select('.sph-col-swatch')
        .style('background', null)
        .attr('class', 'nm-col-swatch-publish');

      lastRow.select('.sph-col-lines-title')
        .text('Changes went live');

      lastRow.select('.sph-col-lines-value')
        .remove();
  },
  drawTotalsChart() {
    d3.select(this.el)
      .select('.nm-chart-totals')
      .datum(this.get('stats'))
      .call(totalsChart)
      .call(this.appendPublishTimes.bind(this));
  },
  close: function() {
    drawers.close(this);
  }
});


var totalsChart = sapphire.widgets.lines()
  .explicitComponents(true)
  .metrics(function(d) {
    return [{
      title: 'Views',
      values: _.zip(d.times, d.views)
    }, {
      title: 'Timeouts',
      values: _.zip(d.times, d.timeouts)
    }, {
      title: 'Answers',
      values: _.zip(d.times, d.answers)
    }];
  })
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });


module.exports = Base;
