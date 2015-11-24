var Action = require('../action');


var OptOut = Action.extend({
  data: function() {
    return {
      title: 'MomConnect: Opt out the user',
      fields: [{
        key: 'msisdn',
        name: 'msisdn',
        userFieldId: 'msisdn'
      }]
    };
  }
});


OptOut.Edit = Action.Edit.extend();


module.exports = OptOut;
