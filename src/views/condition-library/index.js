var _ = require('lodash');
var uuid = require('node-uuid');
var Ractive = require('ractive');
var drawers = require('../../drawers');
var conditionTypes = require('../../components/conditions');


// TODO something similar to this for filters
var ConditionLibrary = Ractive.extend({
  template: require('./template.html'),
  close() {
    drawers.close(this);
  },
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
    d = _.extend({}, conditionTypes[d.type]().get(), d, {id: uuid.v4()});
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
