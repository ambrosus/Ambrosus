"use strict";


const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");


contract('RangeValidator', function(accounts) {

    // it('Deploy contracts', async () => {
    //   var rangeValidator = await RangeValidator.new(measurements.address, requirements.address);
    //   var measurements = await MeasurementsOnChain.new();
    //   var requirements = await RangeRequirements.new();      
    // });

    it('validate int valid field', async () => {
      var measurements = await MeasurementsOnChain.new();
      var requirements = await RangeRequirements.new();
      await requirements.setAttributes(["Volume"], [0], [0], [1], [3]);
      await measurements.addMeasurements(["Volume"], [1], [0], [1312312], [""], [""]);
      var rangeValidator = await RangeValidator.new(measurements.address, requirements.address);
      assert.isOk(await rangeValidator.isValid());
      assert.isOk(await rangeValidator.isAttributeValid(0));
    });
    
    xit('validate boolean (valid)');
    xit('validate boolean (invalid)');
    xit('validate int (valid)');
    xit('validate boolean (invalid)');
    xit('validate mulitple (invalid)');
    xit('validate mulitple (valid)');

});

