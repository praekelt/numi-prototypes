var $ = require('jquery');
var Ractive = require('ractive');
var pg = require('../../../pg');
var BlockLibrary = require('../../../views/block-library');


module.exports = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return {blocks: []};
  },
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    if (this.hasEvent()) library.set('disableEvents', true);
    pg.push(library.el);
  },
  hasEvent: function() {
    return !!this.get('blocks')
      .filter(BlockLibrary.isEvent)
      .length;
  },
  components: {
    ask: require('../../blocks/ask'),
    choice: require('../../blocks/choice'),
    end: require('../../blocks/end'),
    usersendsmessage: require('../../blocks/usersendsmessage'),
    scheduled: require('../../blocks/scheduled'),
    manual: require('../../blocks/manual'),
    validatecliniccode: require('../../blocks/validatecliniccode'),
    shownext9months: require('../../blocks/shownext9months'),
    standardmessageset: require('../../blocks/standardmessageset'),
    latermessageset: require('../../blocks/latermessageset'),
    acceleratedmessageset: require('../../blocks/acceleratedmessageset'),
  }
});
