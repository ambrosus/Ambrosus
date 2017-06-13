"use strict";

const testutils = require("../testutils.js");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");


var measurements;
var requirements;
var rangeValidator;

let IntegerType = 0;
let BooleanType = 1;

contract('RangeValidator', function(accounts) {

    it('Deploy contracts', async () => {
      measurements = await MeasurementsOnChain.new();
      requirements = await RangeRequirements.new();
      rangeValidator = await RangeValidator.new(measurements.address, requirements.address);
      await requirements.setAttributes(["Volume"], [0], [IntegerType], [1], [3]);
      await requirements.setAttributes(["Certified"], [BooleanType], [0], [1], [1]);
      await requirements.setAttributes(["Lactose"], [IntegerType], [1], [66], [72]);
      await requirements.setAttributes(["Fat"], [IntegerType], [2], [330], [341]);            
      await measurements.addMeasurements(["Volume"], [1], [0], [1312312], [""], [""]);
      await measurements.addMeasurements(["Volume"], [4], [0], [1312312], [""], [""]);
      await measurements.addMeasurements(["Certified"], [0], [0], [1312312], [""], [""]);
      await measurements.addMeasurements(["Certified"], [1], [0], [1312312], [""], [""]);
      await measurements.addMeasurements(["Lactose"], [1], [0], [1312312], [""], [""]);
      await measurements.addMeasurements(["Fat"], [1], [0], [1312312], [""], [""]);            
    });

    it('validate int field', async () => {
      assert.isOk(await rangeValidator.isMeasurementValid(0));
      assert.isNotOk(await rangeValidator.isMeasurementValid(1));
    });

    it('validate boolean field', async () => {
      assert.isNotOk(await rangeValidator.isMeasurementValid(2));
      assert.isOk(await rangeValidator.isMeasurementValid(3));
    });

    it('validate multiple fields', async () => {
      var invalidFields = testutils.byte32ArraytoAsciiArray(await rangeValidator.validate());
      assert.deepEqual(invalidFields, ["Volume", "Certified"]);
    });

});

