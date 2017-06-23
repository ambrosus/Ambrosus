"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const BigNumber = require('bignumber.js');
const MeasurementsOffChain = artifacts.require("./protocol/Measurements/MeasurementsOffChain.sol");

var measurementsContract;


contract('MeasurementsOffChain', function(accounts) {

    it('Deploy contracts', async () => {
		measurementsContract = await MeasurementsOffChain.new();
    });

    it("should serialize and deserialize measurements", async () => {
        var serialized = await measurementsContract.serializeMeasurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01", accounts[1], "");
        var deserialized = await measurementsContract.deserializeMeasurement(serialized);
        assert.equal(testutils.byte32toAscii(deserialized[0]), "Volume");        
        assert.deepEqual(deserialized[1], new BigNumber(22));
        assert.equal(testutils.byte32toAscii(deserialized[2]), "delivery");        
        assert.deepEqual(deserialized[3], new BigNumber(1491848127));
        assert.equal(testutils.byte32toAscii(deserialized[4]), "fmr01");
        assert.equal(testutils.byte32toAscii(deserialized[5]), "bch01");                
    });

    it("should get data", async () => {
        var data = await measurementsContract.encodeMeasurements(
            ["Volume", "Color"],
            [22, 777],
            ["delivery", "shipping"],
            [1491848127,1491848135],
            ["fmr01", "fmr02"], 
            ["bch01", "bch02"],
            [accounts[1], accounts[2]],
            ["", ""]);
        var measurements = await measurementsContract.getMeasurements(data);
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



