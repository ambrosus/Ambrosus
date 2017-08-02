const Requirements = require("../../lib/Requirements");
const RequirementsRepository = require('../../lib/RequirementsRepository');
const RequirementsArtifacts = artifacts.require("./protocol/Requirements/RangeRequirements.sol");

contract('Requirements Interface', function(accounts) {
  
  let testAttributes = [
    {
      id: "Volume",
      type: 0,
      decimals: 3,
      min: 22,
      max: 24
    },
    {
      id: "Color",
      type: 0,
      decimals: 6,
      min: 768,
      max: 769
    }
  ];

  beforeEach(async () => {
    reqRepo = new RequirementsRepository(RequirementsArtifacts);
  });

  it('should add and get attributes', async () => {   
    var req = await reqRepo.create(testAttributes);

    var attrs = await req.getAttributes();

    assert.deepEqual(attrs, testAttributes);
  });

  it('should get contract from address', async () => {
    var req1 = await reqRepo.create(testAttributes);
    var req2 = await reqRepo.fromAddress(req1.getAddress());

    var attrs1 = await req1.getAttributes();
    var attrs2 = await req2.getAttributes();

    assert.deepEqual(attrs1, attrs2);
  });

  it('should get attribute by ID', async () => {
    var req = await reqRepo.create(testAttributes);

    var attr = await req.getAttributeById('Color');

    assert.deepEqual(attr, testAttributes[1]);
  });
});
