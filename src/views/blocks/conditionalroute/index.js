var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Base = require('../base');
var drawers = require('../../../drawers');
var ConditionSet = require('../../condition-set');
var ChooseSequence = require('../../drawers/choose-sequence');


var ConditionalRoute = Base.extend({
  template: require('./preview.html'),
  components: {conditions: ConditionSet.Preview},
  onConditionalRouteClick: function(e) {
    e.original.preventDefault();
    this.selectItem(this.get('seqId'), this.get('itemId'));
  },
  isComplete: function() {
    // TODO more truthful condition set check
    return this.get('route')
        && ConditionSet.isComplete(this.get('conditionSet'));
  },
  data: function() {
    return {
      itemId: uuid.v4(),
      seqId: null,
      conditionSet: ConditionSet.prototype.data()
    };
  },
  computed: {
    route: function() {
      var seqId = this.get('seqId');

      return !seqId
        ? null
        : {
          id: seqId,
          name: _.find(this
            .get('dialogue')
            .get('sequences'), {id: seqId})
            .name
        };
    }
  }
});


ConditionalRoute.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  components: {conditions: ConditionSet},
  removeRoute: function() {
    this.set('seqId', null);
  },
  setRoute: function() {
    var self = this;

    var chooser = ChooseSequence({
      el: $('<div>'),
      data: {
        useClose: true,
        dialogue: this.get('dialogue')
      }
    });

    chooser.once('chosen', function(seqId) {
      self.set('seqId', seqId);
      self.get('block').selectItem(seqId, self.get('itemId'));
      self.update('route');
    });

    drawers.open(chooser);
  },
  computed: {
    route: {
      get: function() {
        var seqId = this.get('seqId');

        return !seqId
          ? null
          : {
            id: seqId,
            name: _.find(this
              .get('dialogue')
              .get('sequences'), {id: seqId})
              .name
          };
      },
      set: function() {
      }
    }
  }
});


module.exports = ConditionalRoute;
