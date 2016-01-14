var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');
var Ractive = require('ractive');
var BaseDrawer = require('../../drawers/base');
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
    d.content = {};
    d.stash = {};
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
  oninit: function() {
    this.set('content', _.cloneDeep(this.get('content') || {}));
    this.set('stash', _.cloneDeep(this.get('stash') || {}));
  },
  getEditView: function() {
    var self = this;
    this.get('sequence').scrollToBlock(this.get('id'));

    var edit = this.constructor.Edit({
      el: $('<div>'),
      data: this.getEditData()
    });

    edit.on('change', function() {
      var d = _.omit(edit.get(), self.getEditReadOnlyProps());
      self.set(d);
    });

    return edit;
  },
  getEditReadOnlyProps: function() {
    return _(this.computed)
      .map(function(prop, name) {
        return 'set' in prop
          ? false
          : name;
      })
      .compact()
      .concat('block', 'dialogue')
      .value();
  },
  getEditData: function() {
    var d = this.get();

    _.extend(d, _.mapValues(this.computed, function(v, k) {
      return this.get(k);
    }, this));

    _.extend(d, {
      block: this,
      dialogue: this.get('dialogue')
    });

    return d;
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
    isShowingLanguage: function() {
      var dialogue = this.get('dialogue');
      if (!dialogue) return false;
      return !!dialogue.get('shownLanguageId');
    },
    isNotShowingLanguage: function() {
      return !this.get('isShowingLanguage');
    },
    parentLanguageName: function() {
      return dashboard.getLanguageName(this.getParentLanguageId());
    },
    childLanguageName: function() {
      return dashboard.getLanguageName(this.getCurrentLanguageId());
    },
    dialogue: function() {
      var dialogue = ((this.parent || 0).parent || 0).parent;
      return dialogue
        ? dialogue
        : null;
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
      data: _.extend(this.get(), {block: this})
    });

    drawers.open(stats);
  },
  hasManyLanguages: function() {
    // TODO return false if block precedes language block
    return true;
  },
  getCurrentLanguageId: function() {
    var dialogue = this.get('dialogue');

    return this.hasManyLanguages()
      ? dialogue.getCurrentLanguageId()
      : dialogue.getParentLanguageId();
  },
  getParentLanguageId: function() {
    var dialogue = this.get('dialogue');
    return dialogue.getParentLanguageId();
  },
  parentIsCurrentLanguage() {
    return this.getCurrentLanguageId() === this.getParentLanguageId();
  },
  ensureLangContent: function(id) {
    if (id === 'parent') id = this.getParentLanguageId();
    else if (!id) id = this.getCurrentLanguageId();

    // TODO figure out why we try ensure content when removing a block
    var content = this.get('content');
    if (!content) return {};

    var langContent;
    if (id in content) langContent = content[id];
    else content[id] = langContent = {};

    return langContent;
  },
  ensureContentProp: function(langId, name) {
    var langContent = this.ensureLangContent(langId);
    var val;

    if (name in langContent) val = langContent[name];
    else langContent[name] = val = '';

    return val;
  },
  ensureContentProps: function(langId, id, names) {
    var result = {};
    var i = -1;
    var n = names.length;
    var name;

    while (++i < n) {
      name = names[i];
      result[name] = this.ensureContentProp(langId, [id, name].join('.'));
    }

    return result;
  },
  setContentProp: function(langId, name, v) {
    var langContent = this.ensureLangContent(langId);
    langContent[name] = v;
  },
  setContentProps: function(langId, id, names, d) {
    var i = -1;
    var n = names.length;
    var name;
    var v;

    while (++i < n) {
      name = names[i];
      v = d[name];
      this.setContentProp(langId, [id, name].join('.'), v);
    }
  },
  getForLang: function(langId, name) {
    return this.ensureContentProp(langId, name);
  },
  setForLang: function(langId, name, v) {
    this.setContentProp(langId, name, v);
    this.update(name);
  },
  getForLangList: function(langId, name, contentProps) {
    return this.ensureStash(name)
      .map(function(d) {
        var props = this.ensureContentProps(langId, d.id, contentProps);
        return _.extend({}, d, props);
      }, this);
  },
  setForLangList: function(langId, name, contentProps, data) {
    data.forEach(function(d) {
      this.setContentProps(langId, d.id, contentProps, d);
    }, this);

    this.setStash(name, data.map(function(d) {
      return _.omit(d, contentProps);
    }));

    this.update(name);
  },
  ensureStash: function(name) {
    var stash = this.get('stash.' + name);
    if (!stash) this.set('stash.' + name, stash = []);
    return stash;
  },
  setStash: function(name, v) {
    this.ensureStash(name);
    this.set('stash.' + name, v);
  }
});


Base.Edit = BaseDrawer.extend({
  destroy: function() {
    this.get('block').destroy();
    this.back();
  }
});


Base.Stats = BaseDrawer.extend({
  template: require('./stats.html'),
  oncomplete: function() {
    this.draw();
  },
  draw: function() {
    this.drawTotalsChart();
  },
  appendPublishTimes(el, append) {
    var chart = el.select('.sph-chart');

    var fx = d3.time.scale()
      .domain(d3.extent(times))
      .range([0, 600]);

    if (append)
      chart
        .select('.sph-chart svg > g')
        .append('g')
          .attr('class', 'nm-publish-times');
    else
      chart
        .select('.sph-chart svg > g')
        .insert('g', '.sph-lines-metrics,.sph-areas-metrics')
          .attr('class', 'nm-publish-times');

    chart.select('.nm-publish-times')
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

      lastRow.select('.sph-col-lines-title,.sph-col-areas-title')
        .text('Changes went live');

      lastRow.select('.sph-col-lines-value,.sph-col-areas-value')
        .remove();
  },
  drawTotalsChart() {
    d3.select(this.el)
      .select('.nm-chart-totals')
      .datum(this.get('stats'))
      .call(totalsChart)
      .call(this.appendPublishTimes.bind(this));
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
      title: 'Replies',
      values: _.zip(d.times, d.answers)
    }];
  })
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });


module.exports = Base;
