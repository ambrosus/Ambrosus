"use strict";

const Contribution = artifacts.require("./Contribution.sol");
const DeliveryContract = artifacts.require("./DeliveryContract.sol");
const Qualit = artifacts.require("./Qualit.sol");
const assert = require('assert');
const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let delivery;
let contribution;
let token;

function setup(accounts, done) {
    let startTime;
    let endTime;
    web3.eth.getBlock('earliest', async (err, result) => {
        startTime = result.timestamp;
        endTime = startTime;
        token = await Qualit.new(startTime, endTime)
        delivery = await DeliveryContract.new("The Name", "The Code", token.address);
        done();
    });
}


contract('DeliveryContract', function(accounts) {
    before('Init contracts 1', (done) => { setup(accounts, done); });

    it("should puts tokens in escrow and approve", async () => {
        await token.mintLiquidToken(accounts[0], 1000);
        assert.equal(await token.balanceOf(accounts[0]), 1000);
        await token.approve(delivery.address, 100);
        assert.equal(await token.allowance(accounts[0], delivery.address) , 100);
        await delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]);
        await delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67], {gas: 4000000});
        var p = await delivery.getParticipants();
        assert.deepEqual(p[0], [accounts[1], accounts[2]]);
        assert.deepEqual(p[1], [new BigNumber(33), new BigNumber(67)]);
        assert.equal(await token.balanceOf(accounts[0]), 900);
        assert.equal(await token.balanceOf(delivery.address), 100);
        await delivery.processInvite(accounts[1], true, {from: accounts[1]});
        await delivery.processInvite(accounts[2], true, {from: accounts[2]});
        assert.equal(await delivery.stage(), 3);
        await delivery.approve();
        assert.equal(await token.balanceOf(accounts[0]), 900);
        assert.equal(await token.balanceOf(accounts[1]), 33);
        assert.equal(await token.balanceOf(accounts[2]), 67);
        assert.equal(await token.balanceOf(delivery.address), 0);
    });
});


contract('DeliveryContract', function(accounts) {

    before('Init contracts 2', (done) => { setup(accounts, done); });

    it("should puts tokens in escrow and reimburse", async () => {
        await token.mintLiquidToken(accounts[0], 1000);
        assert.equal(await token.balanceOf(accounts[0]), 1000);
        await delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]);
        await token.approve(delivery.address, 100);
        assert.equal(await token.allowance(accounts[0], delivery.address), 100);
        await delivery.inviteParticipants([accounts[1]], [100]);
        await delivery.processInvite(0, true, {from: accounts[1]});
        assert.equal(await token.balanceOf(accounts[0]), 900);
        assert.equal(await token.balanceOf(delivery.address), 100);
        await delivery.reimburse();
        assert.equal(await token.balanceOf(accounts[0]), 1000);
        assert.equal(await token.balanceOf(delivery.address), 0);
    });

    it("should intialize name & code", async function() {
        assert.equal(testutils.byte32toAscii(await delivery.name()), "The Name");
        assert.equal(testutils.byte32toAscii(await delivery.code()), "The Code");
    });
    
});

contract('DeliveryContract', function(accounts) {

    before('Init contracts 3', (done) => { setup(accounts, done); });

    it("should set attributes", async () => {
        await delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]);
        var attributes = await delivery.getAttributes();
        assert.deepEqual(testutils.byte32ArraytoAsciiArray(attributes[0]), ["Volume", "Color"]);
        assert.deepEqual(attributes[1], [new BigNumber(22), new BigNumber(768)]);
        assert.deepEqual(attributes[2], [new BigNumber(24), new BigNumber(786)]);
    });

    it("set attributes should throw when arguments are arrays of different size", function(done) {
        testutils.expectedExceptionPromise(function () {
            return delivery.setAttributes.sendTransaction(["Volume", "Color"], [22], [21], {gas: 4000000});
        }, 4000000).then(done);
    });

    it("add measurements should throw when arguments are arrays of different size", function(done) {
        testutils.expectedExceptionPromise(function () {
            return delivery.addMeasurements.sendTransaction(
                ["delivery", "shipping"], ["Volume", "Color"], [22], [1491848127,1491848135], ["fmr01", "fmr02"], ["bch01", "bch02"]
                , {gas: 4000000});
        }, 4000000).then(done);
    });

    it("should add measurements", async () => {
        await delivery.addMeasurements(["delivery", "shipping"], ["Volume", "Color"], [22, 777], [1491848127,1491848135], ["fmr01", "fmr02"], ["bch01", "bch02"])
        let measurements = await delivery.getMeasurements();
        let events = testutils.byte32ArraytoAsciiArray(measurements[0]);
        let attributes = testutils.byte32ArraytoAsciiArray(measurements[1]);
        let values = measurements[2].map(e => e.toNumber());
        let timestamps = measurements[3].map(e => e.toNumber());
        let block_timestamps = measurements[4].map(e => e.toNumber());
        let farmer_codes = testutils.byte32ArraytoAsciiArray(measurements[5]);
        let batch_nos = testutils.byte32ArraytoAsciiArray(measurements[6]);
        assert.deepEqual(events, ["delivery", "shipping"]);
        assert.deepEqual(attributes, ["Volume", "Color"]);
        assert.deepEqual(values, [22, 777]);
        assert.deepEqual(timestamps, [1491848127,1491848135]);
        assert.deepEqual(farmer_codes, ["fmr01", "fmr02"]);
        assert.deepEqual(batch_nos, ["bch01", "bch02"]);
    });

});
