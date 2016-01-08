var Action = require('../action');


var Unsubscribe = Action.extend({
  data: function() {
    return {
      title: 'MomConnect: Unsubscribe the user',
      fields: [{
        key: 'msisdn',
        name: 'msisdn',
        userFieldId: 'msisdn'
      }]
    };
  }
});


Unsubscribe.Edit = Action.Edit.extend();


module.exports = Unsubscribe;
