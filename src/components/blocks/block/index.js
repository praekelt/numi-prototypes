var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  components: {
    ask: require('../ask'),
    choice: require('../choice'),
    end: require('../end'),
    send: require('../send'),
    saveas: require('../saveas'),
    lbl: require('../label'),
    rmlbl: require('../rmlabel'),
    userdialsin: require('../userdialsin'),
    usersendsmessage: require('../usersendsmessage'),
    scheduled: require('../scheduled'),
    manual: require('../manual'),
    validatecliniccode: require('../validatecliniccode'),
    shownext9months: require('../shownext9months'),
    standardmessageset: require('../standardmessageset'),
    latermessageset: require('../latermessageset'),
    acceleratedmessageset: require('../acceleratedmessageset'),
    calcweeks: require('../calcweeks'),
    filter: require('../filter')
  }
});
