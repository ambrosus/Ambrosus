const Requirements = require("../../lib/Requirements");
const RequirementsRepository = require('../../lib/RequirementsRepository');
const RequirementsArtifacts = artifacts.require("./protocol/Requirements/RangeRequirements.sol");

contract('Requirements Interface', function(accounts) {

  var requirementsRepository;
  
  let testAttributes = [{
      id: "Volume",
      type: 0,
      decimals: 3,
      min: 22,
      max: 24
    }, {
      id: "Color",
      type: 0,
      decimals: 6,
      min: 768,
      max: 769
  }];

  beforeEach(async () => {
    requirementsRepository = new RequirementsRepository(RequirementsArtifacts);
  });

  it('should add and get attributes', async () => {   
    var requirement = await requirementsRepository.create(testAttributes);

    var attributes = await requirement.getAttributes();

    assert.deepEqual(attributes, testAttributes);
  });

  it('should get contract from address', async () => {
    var requirementOriginal = await requirementsRepository.create(testAttributes);
    var requirementAcquired = await requirementsRepository.fromAddress(requirementOriginal.getAddress());

    var attributesExpected = await requirementOriginal.getAttributes();
    var attributesActual = await requirementAcquired.getAttributes();

    assert.deepEqual(attributesExpected, attributesActual);
  });

  it('should get attribute by ID', async () => {
    var req = await requirementsRepository.create(testAttributes);

    var attribute = await req.getAttributeById('Color');

    assert.deepEqual(attribute, testAttributes[1]);
  });
});
