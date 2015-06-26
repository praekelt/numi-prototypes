var Library = require('../../components/library');


// TODO something similar to this for filters
module.exports = Library.extend({
  data: function() {
    return {
      types: [{
        title: 'Interactions',
        blocks: [{
          title: 'Ask',
          type: 'ask'
        }, {
          title: 'Choice',
          type: 'choice'
        }]
      }, {
        title: 'Events',
        blocks: [{
          title: 'User dials in',
          type: 'userdialsin'
        }, {
          title: 'User replies',
          type: 'userreplies'
        }, {
          title: 'Scheduled',
          type: 'scheduled'
        }, {
          title: 'Manual',
          type: 'manual'
        }]
      }, {
        title: 'Custom components',
        blocks: [{
          title: 'Validate Clinic Code',
          type: 'validatecliniccode'
        }, {
          title: 'Show next 9 months',
          type: 'shownext9months'
        }]
      }, {
        title: 'Message sets',
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
