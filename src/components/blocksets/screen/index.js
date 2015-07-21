var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var BlockLibrary = require('../../../views/block-library');


module.exports = Base.extend({
  template: require('./template.html'),
  data: function() {
    return {blocks: []};
  },
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    if (this.parent.hasEvent()) library.set('disableEvents', true);
    pg.push(library);
  },
  oncomplete: function() {
    $(this.el)
      .find('.sortable-blocks')
      .sortable();
  },
  components: {
    ask: require('../../blocks/ask'),
    choice: require('../../blocks/choice'),
    end: require('../../blocks/end'),
    send: require('../../blocks/send'),
    saveas: require('../../blocks/saveas'),
    lbl: require('../../blocks/label'),
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
