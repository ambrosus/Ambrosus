"use strict";

const abi = require("../../lib/ABI.js");
const Measurement = require("../../lib/Measurement.js");
const MeasurementsStorage = require("../../lib/MeasurementsStorage.js");
const testutils = require("../testutils.js");
const BigNumber = require('bignumber.js');
const Devices = artifacts.require("./protocol/Measurements/Devices.sol");
const MeasurementsOffChain = artifacts.require("./protocol/Measurements/MeasurementsOffChain.sol");


var measurementsContract;

contract('MeasurementsOffChain', function(accounts) {

    let measurement1 = new Measurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01", accounts[1]);
    let measurement2 = new Measurement("Color", 777, "shipping", 1491848135, "fmr02", "bch02", accounts[2]);
    let invalid_measurment = new Measurement("Color", 777, "shipping", 1491848135, "fmr02", "bch02", accounts[5]);

    let example_measurements = [measurement1, measurement2]

    before('Deploy contracts', async () => {
        var devices = await Devices.new([accounts[1], accounts[2]]);
        measurementsContract = await MeasurementsOffChain.new(devices.address);
    });

    it("should serialize and deserialize measurements", async () => {
        var serialized = await measurementsContract.serializeMeasurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01", accounts[1], "", 1, "", "");
        var deserialized = await measurementsContract.deserializeMeasurement(serialized);
        assert.equal(testutils.byte32toAscii(deserialized[0]), "Volume");                
        assert.equal(testutils.byte32toAscii(deserialized[2]), "delivery");        
        assert.equal(testutils.byte32toAscii(deserialized[4]), "fmr01");
        assert.equal(testutils.byte32toAscii(deserialized[5]), "bch01");         
        assert.deepEqual(deserialized[1].toNumber(), 22);
        assert.deepEqual(deserialized[3].toNumber(), 1491848127);
    });

    it("should calcualte hash for measurement (form contract and js)", async () => { 
        var hash = await measurementsContract.hashMeasurement("Volume", 22, "delivery", 1491848127, "fmr01", "bch01", accounts[1]);
        assert.equal(hash, (await measurement1._signedHash())[0]);
    });

    it('should retreive address from signed hash', async ()=>{
        var result = await measurement1.encode();
        assert.isOk(await measurementsContract.isCorrect(result[7],result[8],result[9],result[10],result[6]));
    });

    it("should get data from encoded array", async () => {
        var result = await Measurement.encodeMultiple(example_measurements);
        var measurements = await measurementsContract.getMeasurements(result);
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

    it('should not accept measurment with nonexistent device', async ()=>{
        var result = await invalid_measurment.encode();
        assert.isNotOk(await measurementsContract.validateAddressList(result));

    });

    it('MeasurementsStorage storage should throw error if device doesnt exist',async ()=>{

        var storage = new MeasurementsStorage(null, measurementsContract.address);
        
        try{
            await storage.validateMeasurement(await invalid_measurment.encode());
            assert(false, 'Error expected');
        }
        catch(err){
            assert.equal(err.message,'No device on address list');
        }
    });

    it('MeasurementsStorage storage should throw error if wrong hash',async ()=>{

        var storage = new MeasurementsStorage(null, measurementsContract.address);
        var result = await measurement1.encode();
        result[7]='invalid_hash';
        
        try{
            await storage.validateMeasurement(result);
            assert(false, 'Error expected');
        }
        catch(err){
            assert.equal(err.message,'Wrong hash or not signed');
        }
    });


    it('MeasurementsStorage storage should check if device exists', async ()=>{
        var storage = new MeasurementsStorage(null, measurementsContract.address);
        await storage.validateMeasurement(await Measurement.encodeMultiple([measurement1,measurement2]));    
    });

    it('should verify correct hash', async ()=>{
        var result = await Measurement.encodeMultiple(example_measurements);
        var verification_result = await measurementsContract.verifyHashes(result);
        assert.isOk(verification_result);
    });

    it('should not verify invalid hash', async ()=>{
        var result = await Measurement.encodeMultiple(example_measurements);
        result[7]='invalid_hash';
        var verification_result = await measurementsContract.verifyHashes(result);
        assert.isNotOk(verification_result);
    });

});



