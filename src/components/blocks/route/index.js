var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Base = require('../base');
var drawers = require('../../../drawers');
var ChooseSequence = require('../../../views/choose-sequence');


var Route = Base.extend({
  template: require('./preview.html'),
  onRouteClick: function(e) {
    e.original.preventDefault();
    this.selectItem(this.get('seqId'), this.get('itemId'));
  },
  drawerEdit: false,
  data: function() {
    return {
      itemId: uuid.v4(),
      seqId: null
    };
  },
  computed: {
    route: function() {
      var seqId = this.get('seqId');

      return !seqId
        ? null
        : {
          id: seqId,
          name: _.find(this
            .get('dialogue')
            .get('sequences'), {id: seqId})
            .name
        };
    }
  }
});


Route.Edit = Base.Edit.extend({
  setRoute: function() {
    var self = this;

    var chooser = ChooseSequence({
      el: $('<div>'),
      data: {
        useClose: true,
        dialogue: this.get('dialogue')
      }
    });

    chooser.once('chosen', function(seqId) {
      self.set('seqId', seqId);
      self.get('block').selectItem(seqId, self.get('itemId'));
      self.update('route');
    });

    drawers.open(chooser);
  },
  oncomplete: function() {
    drawers.close(this);
    this.setRoute();
  }
});


module.exports = Route;
