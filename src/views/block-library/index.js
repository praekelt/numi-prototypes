var Library = require('../../components/library');


// TODO something similar to this for filters
module.exports = Library.extend({
  data: function() {
    return {
      types: [{
        title: 'Interactions',
        name: 'interactions',
        blocks: [{
          title: 'Ask',
          type: 'ask'
        }, {
          title: 'Choice',
          type: 'choice'
        }, {
          title: 'End',
          type: 'end'
        }]
      }, {
        title: 'Events',
        name: 'events',
        blocks: [{
          title: 'User dials in',
          type: 'userdialsin'
        }, {
          title: 'User sends message',
          type: 'usersendsmessage'
        }, {
          title: 'Scheduled',
          type: 'scheduled'
        }, {
          title: 'Manual',
          type: 'manual'
        }]
      }, {
        title: 'Custom components',
        name: 'custom-components',
        blocks: [{
          title: 'Validate Clinic Code',
          type: 'validatecliniccode'
        }, {
          title: 'Show next 9 months',
          type: 'shownext9months'
        }]
      }, {
        title: 'Message sets',
        name: 'message-sets',
        blocks: [{
          title: 'Standard Message Set',
          type: 'standardmessageset'
        }, {
          title: 'Later Message Set',
          type: 'latermessageset'
        }, {
          title: 'Accelerated MessageSet',
          type: 'acceleratedmessageset'
        }]
      }]
    };
  }
});
