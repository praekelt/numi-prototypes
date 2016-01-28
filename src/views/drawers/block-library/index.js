var $ = require('jquery');
var _ = require('lodash');
var uuid = require('node-uuid');
var Base = require('../base');
var blockTypes = require('../../blocks');


// TODO something similar to this for filters
var BlockLibrary = Base.extend({
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
    var d = blockTypes[type].prototype.data();
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
    }, {
      name: 'User sends in message',
      type: 'usersendsmessage',
      helptext: 'Run this dialogue when the user sends a message'
    }]
  }, {
    key: 'screens',
    name: 'Screens',
    blocks: [{
      name: 'Question',
      type: 'ask',
      helptext: 'Users are asked a question and can respond with any text'
    }, {
      name: 'Multiple Choice Question',
      type: 'askchoice',
      helptext: 'Users are asked a question with numbered choices and can respond with their choice'
    }, {
      name: 'End Dialogue',
      type: 'end',
      helptext: 'Users are sent content and the dialogue ends.'
    }, {
      name: 'Choose Language',
      type: 'language',
      helptext: [
        "Users are given a choice of languages. Screens that follow",
        "will be shown in the user's chosen langauge."
      ].join(' ')
    }]
  }, {
    key: 'actions',
    name: 'Actions',
    blocks: [{
      name: 'Assign label to the user',
      type: 'setlabel',
      helptext: [
        'Assign a label to the user to use later on to show',
        'them different screens'
      ].join(' ')
    }, {
      name: 'Randomly assign label A or B to the user',
      type: 'ablabel',
      helptext: [
        'Randomly assign one of two labels to the user to use later on to',
        'show them different screens'
      ].join(' ')
    }]
  }, {
    key: 'routing',
    name: 'Routing',
    blocks: [{
      name: 'Go to another sequence',
      type: 'route',
      helptext: 'Route the user to another sequence'
    }, {
      name: 'Conditionally go to another sequence',
      type: 'conditionalroute',
      helptext: 'Route the user to another sequence if a given set of condtions are met'
    }]
  }, {
    key: 'annotations',
    name: 'Annotations',
    blocks: [{
      name: 'Note',
      type: 'annotation',
      helptext: 'Annotate the dialogue with text'
    }]
  }]
}, {
  name: 'MomConnect',
  key: 'momconnect',
  categories: [{
    key: 'screens',
    name: 'Screens',
    blocks: [{
      name: 'Ask for Clinic Code',
      type: 'askcliniccode',
      helptext: 'Users are asked to enter their clinic code. The code is then validated. If users enter an invalid code, they are asked to re-enter the code.'
    }]
  }, {
    key: 'actions',
    name: 'Actions',
    blocks: [{
      name: 'Register the user',
      type: 'register',
      helptext: 'The users is registered to receive stage-based messages.'
    }, {
      name: 'Unsubscribe the user',
      type: 'unsubscribe',
      helptext: 'The user is unsubscribed from receiving stage-based messages, but may be willing to subscribe again in future.'
    }, {
      name: 'Opt out the user',
      type: 'optout',
      helptext: 'The user is opted out of receiving stage-based messages, and will not resubscribed in the future.'
    }]
  }]
}, {
  name: 'Maternal Health Components',
  key: 'maternal',
  categories: [{
    key: 'screens',
    name: 'Screens',
    blocks: [{
      name: 'Next N Months',
      type: 'shownext9months',
      helptext: "The user is given a choice of N months after the current month"
    }]
  }, {
    key: 'calculations',
    name: 'Calculations',
    blocks: [{
      name: 'Calculate expected due date from weeks',
      type: 'calcweeks',
      helptext: "Saves a new expected due date user field from an expected due month user field"
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
