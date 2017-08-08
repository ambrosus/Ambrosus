const Requirements = require("../../lib/Requirements");
const RequirementsRepository = require('../../lib/RequirementsRepository');
const RequirementsArtifacts = artifacts.require("./protocol/Requirements/RangeRequirementsFactory.sol");
const MarketRepository = require('../../lib/MarketRepository');
const MarketArtifacts = artifacts.require("./protocol/Market/Market.sol");

contract('Requirements Interface', function(accounts) {

  var requirementsRepository, market, requirement;
  
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
    market = await new MarketRepository(MarketArtifacts).create(accounts[0]);
    requirement = await requirementsRepository.create("name", market.getAddress(), testAttributes);
  });

  it('should add and get attributes', async () => {
    var attributes = await requirement.getAttributes();

    assert.deepEqual(attributes, testAttributes);
    assert.deepEqual(await requirement.getName(), "name");
  });

  it('should get contract from address', async () => {
    var requirementAcquired = await requirementsRepository.fromAddress(requirement.getAddress());

    var attributesExpected = await requirement.getAttributes();
    var attributesActual = await requirementAcquired.getAttributes();

    assert.deepEqual(attributesExpected, attributesActual);
  });

  it('should get attribute by ID', async () => {
    var attribute = await requirement.getAttributeById('Color');

    assert.deepEqual(attribute, testAttributes[1]);
  });

  it('should get all from market', async () => {
    await requirementsRepository.create("name2", market.getAddress(), testAttributes);

    var result = await requirementsRepository.getAllFromMarket(market);

    assert.equal(result.length, 2);
    assert.deepEqual(await result[1].getName(), "name2");
  });

  it('should get by name from market', async () => {
    await requirementsRepository.create("name2", market.getAddress(), testAttributes);

    var result = await requirementsRepository.findQualityByName("name2", market);

    assert.deepEqual(await result.getName(), "name2");
    assert.deepEqual(await result.getAttributeById('Color'), testAttributes[1]);

  })
});
