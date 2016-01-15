require('ractive-require-templates');
var parse = require('./');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
chai.should();


describe("go2numi", function() {
  it("should parse end states", function() {
    parse({
       start_state: {uuid: 'state1'},
       states: [{
         uuid: 'state1',
         name: 'Ending 1',
         type: 'end',
         store_as: 'ending-1',
         user_defined_store_as: false,
         entry_endpoint: {uuid: 'endpoint5'},
         text: 'Thank you for taking our survey',
       }],
       connections: []
    }).should.shallowDeepEqual({
      sequences: [{
        blocks: [{
          id: 'state1',
          type: 'end',
          text: 'Thank you for taking our survey',
        }]
      }]
    });
  });

  it("should parse freetext states");
  it("should parse unsupported states as annotations");
  it("should parse choice states");
  it("should parse choice states with a more option");
  it("should parse choice states with a back option");
});
