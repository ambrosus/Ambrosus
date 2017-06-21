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
        var serialized = await measurementsContract.serializeMeasurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01");
        var deserialized = await measurementsContract.deserializeMeasurement(serialized);
        assert.equal(testutils.byte32toAscii(deserialized[0]), "Volume");        
        assert.equal(testutils.byte32toAscii(deserialized[2]), "delivery");        
        assert.equal(testutils.byte32toAscii(deserialized[4]), "fmr01");
        assert.equal(testutils.byte32toAscii(deserialized[5]), "bch01");
        assert.deepEqual(deserialized[3], new BigNumber(1491848127));
        assert.deepEqual(deserialized[1], new BigNumber(22));
    });

});



