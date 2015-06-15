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
      }]
    };
  }
});
