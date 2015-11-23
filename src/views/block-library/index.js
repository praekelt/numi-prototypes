var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var drawers = require('../../drawers');
var Ractive = require('ractive');
var blockTypes = require('../../components/blocks');

// TODO something similar to this for filters
var BlockLibrary = Ractive.extend({
  template: require('./template.html'),
  data: function() {
    return BlockLibrary.data;
  },
  computed: {
    activePallete: function() {
      return _.find(this.get('palletes'), {key: this.get('activePalleteKey')});
    }
  },
  setActivePallete: function(event, key) {
    event.original.preventDefault();
    this.set('activePalleteKey', key);
  },
  add: function(type) {
    var key = this.get('key');
    var source = this.get('source');
    var d = blockTypes[type]().get();
    d.type = type;
    d.unedited = true;
    d.id = uuid.v4();
    source.push(key, d);
    this.pushRecent(type);
    source.fire('blockAdded', d);
  },
  pushRecent: function(type) {
    var d = _.chain(this.get('palletes'))
      .pluck('categories')
      .flatten()
      .pluck('blocks')
      .flatten()
      .find({type: type})
      .value();

    if (_.find(this.get('recent'), d)) return;
    this.push('recent', d);
  },
  close() {
    drawers.close(this);
  },
  toggle: function(e, key) {
    e.original.preventDefault();

    $(this.el)
      .find('.nm-pallete[data-key="' + key + '"] .collapse')
      .collapse('toggle');

    var pallete = _.find(this.get('palletes'), {key: key});
    pallete.collapsed = !pallete.collapsed;
    this.update();
  }
});


BlockLibrary.palletes = [{
  name: 'Standard Blocks',
  key: 'standard',
  categories: [{
    key: 'events',
    name: 'Events',
    blocks: [{
      name: 'User dials in',
      type: 'userdialsin',
      helptext: 'Run this dialogue when the user dials in'
    }]
  }, {
    key: 'screens',
    name: 'Screens',
    blocks: [{
      name: 'Question',
      type: 'ask',
      helptext: 'Users are asked a question and can respond with any text'
    }, {
      name: 'Multiple Choice',
      type: 'askchoice',
      helptext: 'Users are asked a question with numbered choices and can respond with their choice'
    }, {
      name: 'End Session',
      type: 'end',
      helptext: 'Users are sent content and the session ends.'
    }]
  }, {
    key: 'routing',
    name: 'Routing',
    blocks: [{
      name: 'Go to another sequence',
      type: 'route',
      helptext: 'Route the user to another sequence'
    }]
  }]
}, {
  name: 'MomConnect',
  key: 'momconnect',
  categories: [{
    key: 'screens',
    name: 'Screens',
    blocks: [{
      name: 'Enter Clinic Code',
      type: 'entercliniccode',
      helptext: 'Users are asked to enter their clinic code. The code is then validated. If users enter an invalid code, they are asked to re-enter the code.'
    }]
  }]
}];


// data persists for session
BlockLibrary.data = {
  key: 'blocks',
  recent: [],
  activePalleteKey: 'standard',
  palletes: _.cloneDeep(BlockLibrary.palletes)
};


module.exports = BlockLibrary;
