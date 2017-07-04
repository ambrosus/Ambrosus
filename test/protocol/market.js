"use strict";

const testutils = require("../testutils.js");
const Market = artifacts.require("./protocol/Market/Market.sol");
const Offer = artifacts.require("./protocol/Market/Offer.sol");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");
const DeliveryAgreement = artifacts.require("./protocol/Agreement/DeliveryAgreement.sol");
const TokenEscrowedParties = artifacts.require("./protocol/Parties/TokenEscrowedParties");
const Qualit = artifacts.require("./Qualit.sol");


let IntegerType = 0;
let BooleanType = 1;

contract('Market', function (accounts) {
	var market, measurements, requirements, validator;
	
	beforeEach(async()=>{	
		market = await Market.new();
		measurements = await MeasurementsOnChain.new();
		requirements = await RangeRequirements.new();
		validator = await RangeValidator.new(measurements.address, requirements.address);
		let attributes = ["Volume", "Certified", "Lactose", "Fat"];
     	let types = [IntegerType, BooleanType, IntegerType, IntegerType];
      	let decimals = [1,0,1,2];
      	let mins = [1, 1, 66, 330];
      	let maxs = [3, 1, 72, 342];
      	await requirements.setAttributes(attributes, types, decimals, mins, maxs);
	});
	
	it('offers empty in the beginning', async ()=>{
		assert.equal(await market.productCount(), 0);
	});
	
	it('should add offers', async ()=>{
		await Offer.new(100,40,"Norway",market.address,measurements.address,requirements.address,validator.address);
		await Offer.new(300,40,"Norway",market.address,measurements.address,requirements.address,validator.address);

		var offer = await Offer.at(await market.productAt(1));
		var req = RangeRequirements.at(await offer.requirements());

		assert.equal(await market.productCount(), 2);
		assert.equal(await offer.pricePerUnit(), 300)
		assert.equal((await req.getAttribute(3))[4], 342);
	});
});

