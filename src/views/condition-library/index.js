var Ractive = require('ractive');
var pg = require('../../pg');


// TODO something similar to this for filters
var ConditionLibrary = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {
      types: ConditionLibrary.types
    };
  },
  addCondition: function(type) {
    this.get('filter').push('conditions', {type: type});
    pg.pop();
  }
});



ConditionLibrary.types = [{
  title: 'Checks',
  name: 'checks',
  blocks: [{
    title: 'Has',
    type: 'has'
  }, {
    title: 'Does not have',
    type: 'not-have'
  }]
}, {
  title: 'Comparison',
  name: 'comparison',
  blocks: [{
    title: 'Less than',
    type: 'lt'
  }, {
    title: 'Less than or equal to',
    type: 'lte'
  }]
}];


module.exports = ConditionLibrary;
