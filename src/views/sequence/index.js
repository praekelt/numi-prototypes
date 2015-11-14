var $ = require('jquery');
var pg = require('../../pg');
var BlockLibrary = require('../block-library');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  partials: {blocks: require('./blocks.html')},
  data: function() {
    return {
      blocks: []
    };
  },
  onrender: function() {
    $(this.find('.nm-rename')).hide();
  },
  rename: function() {
    this.set('nameBackup', this.get('name'));
    $(this.find('.nm-name')).hide();
    $(this.find('.nm-rename')).show();
  },
  hideRename: function() {
    $(this.find('.nm-rename')).hide();
    $(this.find('.nm-name')).show();
  },
  cancelRename: function() {
    this.set('name', this.get('nameBackup'));
    this.hideRename();
  },
  addBlock: function() {
    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    library.set('dialogueView', this);
    pg.push(library);
  },
  components: {
    ask: require('../../components/blocks/ask'),
    choice: require('../../components/blocks/choice'),
    end: require('../../components/blocks/end'),
    send: require('../../components/blocks/send'),
    saveas: require('../../components/blocks/saveas'),
    lbl: require('../../components/blocks/label'),
    rmlbl: require('../../components/blocks/rmlabel'),
    userdialsin: require('../../components/blocks/userdialsin'),
    usersendsmessage: require('../../components/blocks/usersendsmessage'),
    scheduled: require('../../components/blocks/scheduled'),
    manual: require('../../components/blocks/manual'),
    validatecliniccode: require('../../components/blocks/validatecliniccode'),
    shownext9months: require('../../components/blocks/shownext9months'),
    standardmessageset: require('../../components/blocks/standardmessageset'),
    latermessageset: require('../../components/blocks/latermessageset'),
    acceleratedmessageset: require('../../components/blocks/acceleratedmessageset'),
    calcweeks: require('../../components/blocks/calcweeks'),
    filter: require('../../components/blocks/filter')
  }
});
