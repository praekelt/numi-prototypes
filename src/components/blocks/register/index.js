var Action = require('../action');


var Register = Action.extend({
  data: function() {
    return {
      title: 'MomConnect: Register the user',
      fields: [{
        key: 'clinic-code',
        name: 'Clinic Code',
        userField: null
      }, {
        key: 'edd',
        name: 'Expected Due Date',
        userField: null
      }]
    };
  }
});


Register.Edit = Action.Edit.extend();


module.exports = Register;
