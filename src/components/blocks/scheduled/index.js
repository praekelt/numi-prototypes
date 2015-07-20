var Base = require('../base');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {
      frequency: 1,
      interval: 'days'
    };
  },
  oninit: function() {
    this.onchange();
  },
  onchange: function() {
    this.parent.parent.set('schedule.frequency', this.get('frequency'));
    this.parent.parent.set('schedule.interval', this.get('interval'));
  }
});
