var $ = require('jquery');
var drawers = require('../../drawers');
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
    var self = this;

    var library = BlockLibrary({el: $('<div>')});
    library.set('source', this);
    drawers.change(library);
    this.once('blockAdded', function(d) { self.editBlock(d.id); });
  },
  editBlock: function(id) {
    $(this.el)
      .find('.nm-block-wrapper[data-id="' + id + '"] .nm-block-edit')
      .click();
  },
  components: {
    ask: require('../../components/blocks/ask'),
    askchoice: require('../../components/blocks/askchoice'),
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
