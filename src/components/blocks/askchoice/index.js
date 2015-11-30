var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Base = require('../base');
var drawers = require('../../../drawers');
var ChooseSequence = require('../../../views/choose-sequence');
var Chooser = require('../../../views/chooser');
var Areas = require('../../../area');


var AskChoice = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: '',
      allChoices: [this.newChoice()],

      getSequenceName: function(id) {
        var seq = _.find(this.get('dialogue').get('sequences'), {id: id});
        return seq
          ? seq.name
          : '';
      }
    };
  },
  newChoice: function() {
    return {
      id: uuid.v4(),
      text: '',
      saveAs: null,
      route: null,
      answerCounts: this.randDatapoints(0, 1000)
    };
  },
  isComplete: function() {
    return this.get('text')
        && this.get('allChoices').length > 1;
  },
  selectChoice(id) {
    var choice = _.find(this.get('allChoices'), {id: id});
    this.selectItem(choice.route, id);
  },
  onChoiceClick(e, id) {
    e.original.preventDefault();
    this.selectChoice(id);
  },
  oninit: function() {
    this.resetTotals();
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
  },
  computed: {
    choices: function() {
      return (this.get('allChoices') || []).slice(0, -1);
    }
  }
});


AskChoice.Edit = Base.Edit.extend({
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
  oninit: function(d) {
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
    }
  },
  insertUserField: function() {
    var self = this;

    var list = Chooser({
      el: $('<div>'),
      data: {
        title: 'Choose a user field',
        items: dashboard.get('userFields')
      }
    });

    list.once('chosen', function(id, d) {
      self.set('text', self.get('text') + ' [' + d.name + ']');
      drawers.close(list);
    });

    drawers.open(list);
  }
});


AskChoice.Stats = Base.Stats.extend({
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
  },
  drawAnswersPercentageChart() {
    var totalAnswers = this.get('stats.answers');

    d3.select(this.el)
      .select('.nm-chart-answers-percentages')
      .datum({metrics: this.getPercentageMetrics()})
      .call(answerPercentagesChart)
      .call(this.appendPublishTimes.bind(this));
  }
});


function divide(d) {
  return d[0] / d[1];
}


var answerPercentagesChart = Areas()
  .explicitComponents(true)
  .x(function(d) { return d[0]; })
  .y(function(d) { return d[1]; });


module.exports = AskChoice;
