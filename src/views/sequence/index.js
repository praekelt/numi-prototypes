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
  oncomplete: function() {
    var self = this;

    $(this.el)
      .find('.sortable-blocks')
      .sortable({
        start: function() {
          $(this)
            .find('.nm-block-separator')
            .hide();
        },
        stop: function() {
          $(this)
            .show();

          var order = $(self.el)
            .find('.nm-block-wrapper')
            .map(function() {
              return $(this).attr('data-id');
            })
            .get();

          self.reorder(order);
        }
      });
  },
  reorder: function(ids) {
    var blocks = this.get('blocks');

    blocks = _.sortBy(blocks, function(d) {
      return ids.indexOf(d.id);
    });

    // TODO get .merge() to work
    while (this.get('blocks').length) this.pop('blocks');
    while (blocks.length) this.push('blocks', blocks.shift());
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

    this.once('blockAdded', function(d) {
      self.scrollToBlock(d.id);
      self.editBlock(d.id);
    });
  },
  scrollToBlock: function(id) {
    $(this.el)
      .find('.nm-sequence-body')
      .scrollTo('.nm-block-wrapper[data-id="' + id + '"]');
  },
  editBlock: function(id) {
    $(this.el)
      .find('.nm-block-wrapper[data-id="' + id + '"] .nm-block-edit')
      .click();
  },
  removeBlock: function(id) {
    var blocks = this.get('blocks');
    var i = _.indexOf(blocks, {id: id});
    this.splice('blocks', i, 1);
  },
  components: {
    ask: require('../../components/blocks/ask'),
    askchoice: require('../../components/blocks/askchoice'),
    route: require('../../components/blocks/route'),
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
