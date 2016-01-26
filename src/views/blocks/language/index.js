var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Screen = require('../screen');
var drawers = require('../../../drawers');
var ChooseLanguage = require('../../drawers/choose-language');
var Chooser = require('../../drawers/chooser');
var Areas = require('../../../area');
var sapphire = require('../../../../bower_components/sapphire/build/sapphire');


var Language = Screen.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: '',
      allChoices: [this.newChoice()]
    };
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
    choices: function() {
      return (this.get('allChoices') || []).slice(0, -1);
    }
  },
  newChoice: function() {
    return {
      id: uuid.v4(),
      text: '',
      languageId: null,
      answerCounts: this.randDatapoints(0, 1000),

      // I'm out of ideas on how to compute this dynamically
      languageName: null
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
  onconfig: function() {
    Screen.prototype.onconfig.call(this);
    this.resetTotals();
  },
  refreshLanguages: function() {
    this.setMap('allChoices', function(d) {
      d = _.clone(d);
      if (d.languageId) d.languageName = dashboard.getLanguageName(d.languageId);
      return d;
    });
  },
  getAnswerCounts() {
    return _.chain(this.get('allChoices'))
      .slice(0, -1)
      .map('answerCounts')
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


Language.Edit = Screen.Edit.extend({
  template: require('./edit.html'),
  showTab(e, to) {
    e.original.preventDefault();
    $(this.el).find('a[href="#' + to + '"]').tab('show');
    return false;
  },
  addChoice() {
    this.push('allChoices', this.get('block').newChoice());
  },
  onChoiceKeyDown(i, id) {
    if (i < this.get('allChoices').length - 1) {
      this.checkForLang(id);
    } else {
      this.addChoice();
    }
  },
  checkForLang(id) {
    var choice = this.findWhere('allChoices', {id: id});
    if (choice.languageId) return;
    var text = choice.text.toLowerCase();

    var lang = _.find(dashboard.get('languages'), function(d) {
      return text.match(d.name.toLowerCase());
    });

    if (!lang) return;
    this.updateMatches('allChoices', {id: id}, {languageId: lang.id});
  },
  removeChoice: function(id) {
    var choices = this.get('allChoices');
    var i = _.findIndex(choices, {id: id});
    if (i === choices.length - 1) return;
    this.splice('allChoices', i, 1);
  },
  chooseLanguage: function(i, id) {
    if (i === this.get('allChoices').length - 1) return;

    var self = this;
    var chooser = ChooseLanguage({el: $('<div>')});

    chooser.once('chosen', function(languageId) {
      self.updateMatches('allChoices', {id: id}, {languageId: languageId});
      drawers.close(chooser);
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
    this.refreshLanguages();

    this.observe('allChoices', function() {
      self.get('block').resetTotals();
      self.refreshLanguages();
    });

    dashboard.observe('languages', function() {
      self.refreshLanguages();
    });
  },
  refreshLanguages: function() {
    this.setMap('allChoices', function(d) {
      var languageName;
      d = _.clone(d);

      if (d.languageId) languageName = dashboard.getLanguageName(d.languageId);
      if (languageName) d.languageName = languageName;
      else d.languageId = null;

      return d;
    });
  },
  computed: {
    choices: function() {
      return this.get('allChoices').slice(0, -1);
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


Language.Stats = Screen.Stats.extend({
  template: require('./stats.html'),
  draw() {
    this.drawTotalsChart();
    this.drawAnswersChart();
    this.drawAnswersPercentageChart();
  },
  chooseLanguage: function(id) {
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


module.exports = Language;
