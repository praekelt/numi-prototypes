var Base = require('../base');


var NextNMonths = Base.extend({
  template: require('./preview.html'),
  data: function() {
    return {
      text: '',
      saveAs: '',
      monthsAfter: 9
    };
  },
  computed: {
    exampleMonths: function() {
      return [
        "Nov",
        "Dec",
        "Jan '16",
        "Feb '16",
        "Mar '16",
        "Apr '16",
        "May '16",
        "Jun '16",
        "Jul '16",
        "Aug '16",
        "Sep '16",
        "Oct '16",
        "Nov '16",
        "Dec '16"
      ].slice(0, this.get('monthsAfter'));
    }
  }
});


NextNMonths.Edit = Base.Edit.extend({
  template: require('./edit.html'),
  computed: {
    useAnswerSaving: function() {
      return !!this.get('saveAs');
    }
  }
});


module.exports = NextNMonths;
