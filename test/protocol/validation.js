"use strict";


const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");

var measurements;
var requirements;

contract('RangeValidator', function(accounts) {

    it('Deploy contracts', async () => {
      measurements = await MeasurementsOnChain.new();
      requirements = await RangeRequirements.new();
      await requirements.setAttributes(["Volume"], [0], [0], [1], [3]);
      await measurements.addMeasurements(["Volume"], [1], [0], [1312312], [""], [""]);
      await measurements.addMeasurements(["Volume"], [4], [0], [1312312], [""], [""]);
    });

    it('validate int field', async () => {
      var rangeValidator = await RangeValidator.new(measurements.address, requirements.address);
      assert.isOk(await rangeValidator.isAttributeValid(0));
      assert.isNotOk(await rangeValidator.isAttributeValid(1));
    });
    
    xit('validate boolean (valid)');
    xit('validate boolean (invalid)');
    xit('validate int (valid)');
    xit('validate boolean (invalid)');
    xit('validate mulitple (invalid)');
    xit('validate mulitple (valid)');

});

