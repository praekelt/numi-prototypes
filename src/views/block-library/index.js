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
      },
      {
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
      }]
    };
  }
});
