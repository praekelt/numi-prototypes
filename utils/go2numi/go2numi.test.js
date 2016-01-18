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
         name: 'Start',
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
         name: 'Start',
         uuid: 'state1',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint1'},
         exit_endpoint: {uuid: 'endpoint2'},
         text: 'Say something'
       }],
       connections: []
    }).should.shallowDeepEqual({
      sequences: [{
        blocks: [{
          id: 'state1',
          type: 'ask',
          text: 'Say something'
        }]
      }]
    });
  });

  it("should parse unsupported states as annotations", function() {
    parse({
       start_state: {uuid: 'state1'},
       states: [{
         name: 'Start',
         uuid: 'state1',
         type: 'dummy',
         entry_endpoint: {uuid: 'endpoint1'},
         exit_endpoint: {uuid: 'endpoint2'},
       }],
       connections: []
    }).should.shallowDeepEqual({
      sequences: [{
        blocks: [{
          id: 'state1',
          type: 'annotation',
          text: 'dummy'
        }]
      }]
    });
  });

  it("should parse linear dialogues", function() {
    parse({
       start_state: {uuid: 'state1'},
       states: [{
         name: 'Start',
         uuid: 'state1',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint1'},
         exit_endpoint: {uuid: 'endpoint2'},
         text: 'Say something'
       }, {
         uuid: 'state2',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint3'},
         exit_endpoint: {uuid: 'endpoint4'},
         text: 'Say something else'
       }, {
         uuid: 'state3',
         type: 'end',
         text: 'Bye',
         entry_endpoint: {uuid: 'endpoint5'},
       }],
       connections: [{
         source: {uuid: 'endpoint2'},
         target: {uuid: 'endpoint3'}
       }, {
         source: {uuid: 'endpoint4'},
         target: {uuid: 'endpoint5'}
       }]
    }).should.shallowDeepEqual({
      sequences: [{
        name: 'Start',
        blocks: [
          {id: 'state1'},
          {id: 'state2'},
          {id: 'state3'}
        ]
      }]
    });
  });

  it("should parse dialogues with states containing the same target state",
  function() {
    parse({
       start_state: {uuid: 'state1'},
       states: [{
         name: 'Start',
         uuid: 'state1',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint1'},
         exit_endpoint: {uuid: 'endpoint2'},
         text: 'Say something'
       }, {
         name: 'Not Shown',
         uuid: 'state2',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint3'},
         exit_endpoint: {uuid: 'endpoint4'},
         text: 'Not actually shown'
       }, {
         name: 'Continue',
         uuid: 'state3',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint5'},
         exit_endpoint: {uuid: 'endpoint6'},
         text: 'Say something else'
       }, {
         uuid: 'state4',
         type: 'end',
         text: 'Bye',
         entry_endpoint: {uuid: 'endpoint7'},
       }],
       connections: [{
         source: {uuid: 'endpoint2'},
         target: {uuid: 'endpoint5'}
       }, {
         source: {uuid: 'endpoint4'},
         target: {uuid: 'endpoint5'}
       }, {
         source: {uuid: 'endpoint6'},
         target: {uuid: 'endpoint7'}
       }]
    }).should.shallowDeepEqual({
      sequences: [{
        name: 'Start',
        blocks: [{
          id: 'state1'
        }, {
          type: 'route',
          seqId: 'seq:state3'
        }]
      }, {
        id: 'seq:state3',
        name: 'Continue',
        blocks: [{
          id: 'state3'
        }, {
          id: 'state4'
        }]
      }, {
        name: 'Not Shown',
        blocks: [{
          id: 'state2'
        }, {
          type: 'route',
          seqId: 'seq:state3'
        }]
      }]
    });
  });

  it("should parse choice states with a more option");

  it("should parse choice states with a back option");
});
