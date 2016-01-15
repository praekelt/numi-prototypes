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
         type: 'end',
         text: 'Thank you for taking our survey',
       }],
       connections: []
    }).should.shallowDeepEqual({
      sequences: [{
        blocks: [{
          id: 'state1',
          type: 'end',
          text: 'Thank you for taking our survey'
        }]
      }]
    });
  });

  it("should parse freetext states", function() {
    parse({
       start_state: {uuid: 'state1'},
       states: [{
         uuid: 'state1',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint1'},
         exit_endpoint: {uuid: 'endpoint2'},
         text: 'Say something'
       }, {
         uuid: 'state2',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint2'},
         exit_endpoint: {uuid: 'endpoint3'},
         text: 'Say something else'
       }],
       connections: []
    }).should.shallowDeepEqual({
      sequences: [{
        blocks: [{
          id: 'state1',
          type: 'ask',
          text: 'Say something'
        }, {
          id: 'state2',
          type: 'ask',
          text: 'Say something else'
        }]
      }]
    });
  });

  it("should parse unsupported states as annotations");
  it("should parse choice states");
  it("should parse choice states with a more option");
  it("should parse choice states with a back option");
});
