"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");
const DeliveryAgreement = artifacts.require("./protocol/Agreement/DeliveryAgreement.sol");
const Parties = artifacts.require("./protocol/Parties/Parties.sol");
const FoodCoin = artifacts.require("./FoodCoin.sol");
const BigNumber = require('bignumber.js');

var agreement;

contract('DeliveryAgreement', function(accounts) {

    it('Deploy contracts', async () => {
        var result = await web3.eth.getBlock('earliest');
        var startTime = result.timestamp;
		var foodCoin = await FoodCoin.new(startTime, startTime);
        var measurements = await MeasurementsOnChain.new();
        var requirements = await RangeRequirements.new();
        var validator = await RangeValidator.new();
        var parties = await Parties.new();`
        var agreement = await DeliveryAgreement.new(foodCoin.address, measurements.address, requirements.address, validator.address, parties.address);
    });

});

