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
         type: 'choice',
         text: 'What is your favourite colour?',
         entry_endpoint: {uuid: 'endpoint3'},
         choice_endpoints: [{
           uuid: 'endpoint4',
           label: 'Red'
         }, {
           uuid: 'endpoint5',
           label: 'Blue'
         }]
       }, {
         uuid: 'state3',
         type: 'freetext',
         text: 'Say something else',
         entry_endpoint: {uuid: 'endpoint6'},
         exit_endpoint: {uuid: 'endpoint7'}
       }, {
         uuid: 'state4',
         type: 'end',
         text: 'Bye',
         entry_endpoint: {uuid: 'endpoint8'}
       }],
       connections: [{
         source: {uuid: 'endpoint2'},
         target: {uuid: 'endpoint3'}
       }, {
         source: {uuid: 'endpoint4'},
         target: {uuid: 'endpoint6'}
       }, {
         source: {uuid: 'endpoint5'},
         target: {uuid: 'endpoint6'}
       }, {
         source: {uuid: 'endpoint7'},
         target: {uuid: 'endpoint8'}
       }]
    }).should.shallowDeepEqual({
      sequences: [{
        name: 'Start',
        blocks: [
          {id: 'state1'},
          {id: 'state2'},
          {id: 'state3'},
          {id: 'state4'}
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
         type: 'choice',
         text: 'What is your favourite colour?',
         entry_endpoint: {uuid: 'endpoint1'},
         choice_endpoints: [{
           uuid: 'endpoint2',
           label: 'Red'
         }, {
           uuid: 'endpoint3',
           label: 'Blue'
         }]
       }, {
         name: 'Ask the user to say something',
         uuid: 'state2',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint4'},
         exit_endpoint: {uuid: 'endpoint5'},
         text: 'Say something'
       }, {
         name: 'Ask the user their name',
         uuid: 'state3',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint6'},
         exit_endpoint: {uuid: 'endpoint7'},
         text: 'What is your name?'
       }, {
         name: 'Continue',
         uuid: 'state4',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint8'},
         exit_endpoint: {uuid: 'endpoint9'},
         text: 'Say something else'
       }, {
         uuid: 'state5',
         type: 'end',
         text: 'Bye',
         entry_endpoint: {uuid: 'endpoint10'},
       }],
       connections: [{
         source: {uuid: 'endpoint2'},
         target: {uuid: 'endpoint4'}
       }, {
         source: {uuid: 'endpoint3'},
         target: {uuid: 'endpoint6'}
       }, {
         source: {uuid: 'endpoint5'},
         target: {uuid: 'endpoint8'}
       }, {
         source: {uuid: 'endpoint7'},
         target: {uuid: 'endpoint8'}
       }, {
         source: {uuid: 'endpoint9'},
         target: {uuid: 'endpoint10'}
       }]
    }).should.shallowDeepEqual({
      sequences: [{
        name: 'Start',
        blocks: [{
          id: 'state1',
          allChoices: [{
            route: 'seq:state2',
            text: 'Red'
          }, {
            route: 'seq:state3',
            text: 'Blue'
          }]
        }]
      }, {
        id: 'seq:state2',
        name: 'Ask the user to say something',
        blocks: [{
          id: 'state2'
        }, {
          type: 'route',
          seqId: 'seq:state4'
        }]
      }, {
        id: 'seq:state3',
        name: 'Ask the user their name',
        blocks: [{
          id: 'state3'
        }, {
          type: 'route',
          seqId: 'seq:state4'
        }]
      }, {
        id: 'seq:state4',
        name: 'Continue',
        blocks: [{
          id: 'state4'
        }, {
          id: 'state5'
        }]
      }]
    });
  });

  it("should parse choice states with a more option", function() {
    parse({
       start_state: {uuid: 'state1'},
       states: [{
         name: 'Start',
         uuid: 'state1',
         type: 'choice',
         text: 'What is your favourite colour?',
         entry_endpoint: {uuid: 'endpoint1'},
         choice_endpoints: [{
           uuid: 'endpoint2',
           label: 'Red'
         }, {
           uuid: 'endpoint3',
           label: 'More'
         }]
       }, {
         name: 'Ask the user to say something',
         uuid: 'state2',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint4'},
         exit_endpoint: {uuid: 'endpoint5'},
         text: 'Say something'
       }, {
         name: 'Ask the user their name',
         uuid: 'state3',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint6'},
         exit_endpoint: {uuid: 'endpoint7'},
         text: 'What is your name?'
       }, {
         name: 'Continue',
         uuid: 'state4',
         type: 'freetext',
         entry_endpoint: {uuid: 'endpoint8'},
         exit_endpoint: {uuid: 'endpoint9'},
         text: 'Say something else'
       }, {
         uuid: 'state5',
         type: 'end',
         text: 'Bye',
         entry_endpoint: {uuid: 'endpoint10'},
       }],
       connections: [{
         source: {uuid: 'endpoint2'},
         target: {uuid: 'endpoint4'}
       }, {
         source: {uuid: 'endpoint3'},
         target: {uuid: 'endpoint6'}
       }, {
         source: {uuid: 'endpoint5'},
         target: {uuid: 'endpoint8'}
       }, {
         source: {uuid: 'endpoint7'},
         target: {uuid: 'endpoint8'}
       }, {
         source: {uuid: 'endpoint9'},
         target: {uuid: 'endpoint10'}
       }]
    }).should.shallowDeepEqual({
      sequences: [{
        name: 'Start',
        blocks: [{
          id: 'state1',
          allChoices: [{
            route: 'seq:state2',
            text: 'Red'
          }, {
            route: null,
            text: 'More'
          }]
        }, {
          id: 'state3'
        }, {
          type: 'route',
          seqId: 'seq:state4'
        }]
      }, {
        id: 'seq:state2',
        name: 'Ask the user to say something',
        blocks: [{
          id: 'state2'
        }, {
          type: 'route',
          seqId: 'seq:state4'
        }]
      }, {
        id: 'seq:state4',
        name: 'Continue',
        blocks: [{
          id: 'state4'
        }, {
          id: 'state5'
        }]
      }]
    });
  });

  it("should parse choice states with a back option", function() {
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
         type: 'choice',
         text: 'What is your favourite colour?',
         entry_endpoint: {uuid: 'endpoint3'},
         choice_endpoints: [{
           uuid: 'endpoint4',
           label: 'Red'
         }, {
           uuid: 'endpoint5',
           label: 'Back'
         }]
       }, {
         uuid: 'state3',
         type: 'end',
         text: 'Bye',
         entry_endpoint: {uuid: 'endpoint6'},
       }],
       connections: [{
         source: {uuid: 'endpoint2'},
         target: {uuid: 'endpoint3'}
       }, {
         source: {uuid: 'endpoint4'},
         target: {uuid: 'endpoint6'}
       }, {
         source: {uuid: 'endpoint5'},
         target: {uuid: 'endpoint1'}
       }]
    }).should.shallowDeepEqual({
      sequences: [{
        name: 'Start',
        blocks: [{
          id: 'state1',
        }, {
          id: 'state2',
          allChoices: [{
            route: null,
            text: 'Red'
          }, {
            route: null,
            text: 'Back'
          }]
        }, {
          id: 'state3'
        }]
      }]
    });
  });
});
