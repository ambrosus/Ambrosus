"use strict";


const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");


contract('Validator', function(accounts) {

    it('Deploy Contribution contracts', async () => {
      var measurements = await MeasurementsOnChain.new();
      var requirements = await RangeRequirements.new();
      var rangeValidator = await RangeValidator.new(measurements.address, requirements.address);
    });

});

