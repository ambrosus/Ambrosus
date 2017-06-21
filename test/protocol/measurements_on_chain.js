"use strict";

const testutils = require("../testutils.js");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");

var measurementsContract;

contract('MeasurementsOnChain', function(accounts) {

    it('Deploy contracts', async () => {
		measurementsContract = await MeasurementsOnChain.new();
    });

    it("should add measurements", async () => {
        await measurementsContract.addMeasurements(
        	["Volume", "Color"],
        	[22, 777],
        	["delivery", "shipping"],
        	[1491848127,1491848135],
        	["fmr01", "fmr02"], 
        	["bch01", "bch02"]);
        let measurements = await measurementsContract.getMeasurements([]);
        let attributes = testutils.byte32ArraytoAsciiArray(measurements[0]);
        let values = measurements[1].map(e => e.toNumber());
        let events = testutils.byte32ArraytoAsciiArray(measurements[2]);
        let timestamps = measurements[3].map(e => e.toNumber());
        let farmer_codes = testutils.byte32ArraytoAsciiArray(measurements[4]);
        let batch_nos = testutils.byte32ArraytoAsciiArray(measurements[5]);
        assert.deepEqual(events, ["delivery", "shipping"]);
        assert.deepEqual(attributes, ["Volume", "Color"]);
        assert.deepEqual(values, [22, 777]);
        assert.deepEqual(timestamps, [1491848127,1491848135]);
        assert.deepEqual(farmer_codes, ["fmr01", "fmr02"]);
        assert.deepEqual(batch_nos, ["bch01", "bch02"]);
    });

});

