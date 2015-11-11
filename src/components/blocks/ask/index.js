var Interaction = require('../interaction');


var AskEdit = Interaction.Edit.extend({
  template: require('./edit.html')
});


var AskPreview = Interaction.Preview.extend({
});


var Ask = Interaction.extend({
  components: {
    edit: AskEdit,
    preview: AskPreview
  }
});


Ask.Edit = AskEdit;
Ask.Preview = AskPreview;
module.exports = Ask;
