var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Screen = require('../screen');
var blockUtils = require('../utils');
var utils = require('../../../utils');
var drawers = require('../../../drawers');
var ChooseSequence = require('../../drawers/choose-sequence');
var Chooser = require('../../drawers/chooser');
var Areas = require('../../../area');
var sapphire = require('../../../../bower_components/sapphire/build/sapphire');


var AskChoice = Screen.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      saveAs: '',
      getSequenceName: function(id) {
        var seq = _.find(this.get('dialogue').get('sequences'), {id: id});
        return seq
          ? seq.name
          : '';
      }
    };
  },
  onconfig: function() {
    if (this.get('allChoices').length < 1) {
      this.push('allChoices', this.newChoice());
    }

    this.resetTotals();
  },
  computed: {
    charCount: function() {
      return [this.get('text')]
        .concat(this.get('choices')
          .map(function(d, i) {
            return [i, '. ', d.text].join('');
          }))
        .join('\n')
        .length;
    },
    hasNonAsciiChars: function() {
      return [this.get('text')]
        .concat(this.get('choices')
          .map(function(d) { return d.text; }))
        .some(utils.isNonAscii);
    },
    text: blockUtils.contentProp('text'),
    textParent: blockUtils.contentPropGetter('text', 'parent'),
    choices: function() {
      return (this.get('allChoices') || []).slice(0, -1);
    },
    choicesParent: function() {
      return (this.get('allChoicesParent') || []).slice(0, -1);
    },
    choicesPreview: function() {
      return this.get('allChoicesPreview').slice(0, -1);
    },
    allChoices: blockUtils.listPropWithContent(
        'allChoices', ['text']),
    allChoicesPreview: blockUtils.parentAndCurrentListGetter(
        'allChoices', ['text']),
    allChoicesParent: blockUtils.listPropWithContentGetter(
        'allChoices', ['text'], 'parent')
  },
  newChoice: function() {
    return {
      id: uuid.v4(),
      text: '',
      route: null,
      saveAs: null,
      answerCounts: this.randDatapoints(0, 1000)
    };
  },
  isComplete: function() {
    return this.get('text')
        && this.get('allChoices').length > 1;
  },
  selectChoice(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    if (choice.route) this.selectItem(choice.route, id);
  },
  onChoiceClick(id) {
    this.selectChoice(id);
  },
  getAnswerCounts() {
    return _.chain(this.get('allChoices'))
      .slice(0, -1)
      .pluck('answerCounts')
      .unzip()
      .map(_.sum)
      .value();
  },
  resetTotals: function() {
    var answers = this.getAnswerCounts();
    var timeouts = this.get('stats.timeouts');
    var views = _.zip(timeouts, answers).map(_.sum);
    this.set('stats.answers', answers);
    this.set('stats.views', views);
  }
});


AskChoice.Edit = Screen.Edit.extend({
  template: require('./edit.html'),
  showTab(e, to) {
    e.original.preventDefault();
    $(this.el).find('a[href="#' + to + '"]').tab('show');
    return false;
  },
  addChoice() {
    this.push('allChoices', this.get('block').newChoice());
  },
  onChoiceKeyDown(i) {
    if (i < this.get('allChoices').length - 1) return;
    this.addChoice();
  },
  removeRoute: function(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    choice.route = null;
    this.update('allChoices');
  },
  removeChoice: function(id) {
    var choices = this.get('allChoices');
    var i = _.findIndex(choices, {id: id});
    if (i === choices.length - 1) return;
    this.splice('allChoices', i, 1);
  },
  onRouteClick: function(e, id) {
    e.original.preventDefault();
    this.get('block').selectChoice(id);
  },
  setRoute: function(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    var self = this;

    var chooser = ChooseSequence({
      el: $('<div>'),
      data: {dialogue: this.get('dialogue')}
    });

    chooser.once('chosen', function(seqId) {
      choice.route = seqId;
      self.update();
      self.get('block').selectItem(seqId, id);
    });

    drawers.open(chooser);
  },
  data: {
    getSequenceName: function(id) {
      return _.find(this
        .get('dialogue')
        .get('sequences'), {id: id})
        .name;
    }
  },
  oninit: function() {
    var self = this;

    this.observe('allChoices', function() {
      self.get('block').resetTotals();
    });
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
    },
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    },
    choiceSpan: function() {
      return this.get('useAnswerSaving')
        ? 9
        : 18;
    }
  },
  insertUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.getUserFields()
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


AskChoice.Stats = Screen.Stats.extend({
  template: require('./stats.html'),
  draw() {
    this.drawTotalsChart();
    this.drawAnswersChart();
    this.drawAnswersPercentageChart();
  },
  getMetrics() {
    var times = this.get('stats.times');

    return this.get('allChoices')
      .slice(0, -1)
      .map(function(d) {
        return {
          key: d.id,
          title: d.text,
          values: _.zip(times, d.answerCounts)
        };
      });
  },
  getPercentageMetrics() {
    var times = this.get('stats.times');
    var answers = this.get('stats.answers');

    return this.get('allChoices')
      .slice(0, -1)
      .map(function(d) {
        return {
          key: d.id,
          title: d.text,
          values: _.zip(times, _.zip(d.answerCounts, answers).map(divide))
        };
      });
  },
  drawAnswersChart() {
    d3.select(this.el)
      .select('.nm-chart-answers')
      .datum({metrics: this.getMetrics()})
      .call(answersChart)
      .call(this.appendPublishTimes.bind(this));
  },
  drawAnswersPercentageChart() {
    d3.select(this.el)
      .select('.nm-chart-answers-percentages')
      .datum({metrics: this.getPercentageMetrics()})
      .call(answerPercentagesChart);
  }
});


function divide(d) {
  return d[0] / d[1];
}


var answersChart = sapphire.widgets.lines()
  .explicitComponents(true)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });


var answerPercentagesChart = Areas()
  .explicitComponents(true)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });


module.exports = AskChoice;
