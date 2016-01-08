var Action = require('../action');


var Register = Action.extend({
  data: function() {
    return {
      title: 'MomConnect: Register the user',
      fields: [{
        key: 'msisdn',
        name: 'msisdn',
        userFieldId: 'msisdn'
      }, {
        key: 'clinic-code',
        name: 'Clinic Code',
        userFieldId: null
      }, {
        key: 'edd',
        name: 'Expected Due Date',
        userFieldId: null
      }]
    };
  }
});


Register.Edit = Action.Edit.extend();


module.exports = Register;
