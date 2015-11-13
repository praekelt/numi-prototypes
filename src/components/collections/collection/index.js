var Base = require('../base');


module.exports = Base.extend({
  template: require('./template.html'),
  partials: {
    blocks: require('./blocks.html')
  },
  components: {
    ask: require('../../blocks/ask'),
    choice: require('../../blocks/choice'),
    end: require('../../blocks/end'),
    send: require('../../blocks/send'),
    saveas: require('../../blocks/saveas'),
    lbl: require('../../blocks/label'),
    rmlbl: require('../../blocks/rmlabel'),
    userdialsin: require('../../blocks/userdialsin'),
    usersendsmessage: require('../../blocks/usersendsmessage'),
    scheduled: require('../../blocks/scheduled'),
    manual: require('../../blocks/manual'),
    validatecliniccode: require('../../blocks/validatecliniccode'),
    shownext9months: require('../../blocks/shownext9months'),
    standardmessageset: require('../../blocks/standardmessageset'),
    latermessageset: require('../../blocks/latermessageset'),
    acceleratedmessageset: require('../../blocks/acceleratedmessageset'),
    calcweeks: require('../../blocks/calcweeks'),
    filter: require('../../blocks/filter')
  }
});
