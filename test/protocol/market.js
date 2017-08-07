"use strict";

const testutils = require("../testutils.js");
const Market = artifacts.require("./protocol/Market/Market.sol");
const Offer = artifacts.require("./protocol/Market/Offer.sol");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirementsFactory = artifacts.require("./protocol/Requirements/RangeRequirementsFactory.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");
const DeliveryAgreement = artifacts.require("./protocol/Agreement/DeliveryAgreement.sol");
const TokenEscrowedParties = artifacts.require("./protocol/Parties/TokenEscrowedParties");
const Amber = artifacts.require("./Amber.sol");


let IntegerType = 0;
let BooleanType = 1;

contract('Market', function(accounts) {
  var market, measurements, requirements, validator;

  beforeEach(async() => {
    market = await Market.new();
    measurements = await MeasurementsOnChain.new();
    requirements = await RangeRequirementsFactory.new("name", market.address);
    validator = await RangeValidator.new(measurements.address, requirements.address);
    let attributes = ["Volume", "Certified", "Lactose", "Fat"];
    let types = [IntegerType, BooleanType, IntegerType, IntegerType];
    let decimals = [1, 0, 1, 2];
    let mins = [1, 1, 66, 330];
    let maxs = [3, 1, 72, 342];
    await requirements.setAttributes(attributes, types, decimals, mins, maxs);
  });

  it('offers empty in the beginning', async() => {
    assert.equal(await market.productCount(), 0);
  });

  it('should add offers', async() => {
    await Offer.new("Fish", "Norway", "shark", "Qma", 40, 300, market.address, measurements.address, requirements.address, validator.address);
    await Offer.new("Fish", "Norway", "shark", "Qma", 40, 300, market.address, measurements.address, requirements.address, validator.address);

    var offer = await Offer.at(await market.productAt(1));
    var offerRequirements = RangeRequirementsFactory.at(await offer.requirements());

    assert.equal(await market.productCount(), 2);
    assert.equal(await offer.pricePerUnit(), 300)
    assert.equal((await offerRequirements.getAttribute(3))[4], 342);
  });

  it('should add requirements', async() => {
    var marketRequirements = await RangeRequirementsFactory.at(await market.requirementsAt(0));

    assert.equal(await market.requirementsCount(), 1);
    assert.equal((await marketRequirements.getAttribute(3))[4], 342);
  });

  it('get requirement by name', async() => {
    requirements = await RangeRequirementsFactory.new("name2", market.address);
    let attributes = ["Volume", "Certified", "Lactose", "Fat", "Gluten"];
    let types = [IntegerType, BooleanType, IntegerType, IntegerType, IntegerType];
    let decimals = [1, 0, 1, 2, 1];
    let mins = [1, 1, 66, 330, 1];
    let maxs = [3, 1, 72, 342, 2];
    await requirements.setAttributes(attributes, types, decimals, mins, maxs);

    var requirement = RangeRequirementsFactory.at(await market.getRequirementsByName("name2"));
    
    assert.equal((await requirement.getAttribute(4))[4], 2);
  })
});
