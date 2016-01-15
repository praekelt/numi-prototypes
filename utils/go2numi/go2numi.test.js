var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
chai.should();


describe("go2numi", function() {
  it("should parse freetext states");
  it("should parse end states");
  it("should parse unsupported states as annotations");
  it("should parse choice states");
  it("should parse choice states with a more option");
  it("should parse choice states with a back option");
});
