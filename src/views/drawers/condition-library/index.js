var _ = require('lodash');
var Base = require('../base');
var conditions = require('../../conditions');


// TODO something similar to this for filters
var ConditionLibrary = Base.extend({
  template: require('./template.html'),
  data: function() {
    return ConditionLibrary.data;
  },
  computed: {
    activePallete: function() {
      return _.find(this.get('palletes'), {key: this.get('activePalleteKey')});
    }
  },
  setActivePallete: function(event, key) {
    event.original.preventDefault();
    this.set('activePalleteKey', key);
  },
  add: function(d) {
    d = conditions.create(d);
    this.pushRecent(d.type);
    this.fire('chosen', d);
  },
  pushRecent: function(type) {
    var d = _.chain(this.get('palletes'))
      .pluck('categories')
      .flatten()
      .pluck('conditions')
      .flatten()
      .find({type: type})
      .value();

    if (_.find(this.get('recent'), d)) return;
    this.push('recent', d);
  },
  toggle: function(e, key) {
    e.original.preventDefault();

    $(this.el)
      .find('.nm-pallete[data-key="' + key + '"] .collapse')
      .collapse('toggle');

    var pallete = _.find(this.get('palletes'), {key: key});
    pallete.collapsed = !pallete.collapsed;
    this.update();
  }
});


ConditionLibrary.palletes = [{
  name: 'Standard Conditions',
  key: 'standard',
  categories: [{
    key: 'number',
    name: 'Number comparisons',
    conditions: ['<', '>', '=', '≤', '≥']
      .map(function(operator) {
        return {
          name: operator,
          operator: operator,
          type: 'comparison',
          dataType: 'number'
        };
      })
  }, {
    key: 'text',
    name: 'Text comparisons',
    conditions: [['=', 1], ['contains', 3]]
      .map(function(d) {
        return {
          name: d[0],
          operator: d[0],
          type: 'comparison',
          dataType: 'text',
          operatorSpan: d[1]
        };
      })
  }, {
    key: 'date',
    name: 'Date conditions',
    conditions: [{
      name: "Date hasn't been reached",
      type: 'datefuture'
    }, {
      name: "Date has passed",
      type: 'datepast'
    }, ]
  }, {
    key: 'label',
    name: 'Label conditions',
    conditions: [{
      name: 'User has the label',
      type: 'haslabel'
    }, {
      name: "User doesn't have the label",
      type: 'nothaslabel'
    }]
  }]
}];


// data persists for session
ConditionLibrary.data = {
  key: 'conditions',
  recent: [],
  activePalleteKey: 'standard',
  palletes: _.cloneDeep(ConditionLibrary.palletes)
};


module.exports = ConditionLibrary;
