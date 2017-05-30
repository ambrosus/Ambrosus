"use strict";

const Contribution = artifacts.require("./Contribution.sol");
const DeliveryContract = artifacts.require("./DeliveryContract.sol");
const FoodCoin = artifacts.require("./FoodCoin.sol");
const assert = require('assert');
const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let delivery;
let contribution;
let token;

function setup(accounts, done) {
    let startTime;
    let endTime;
    web3.eth.getBlock('earliest', (err, result) => {
        startTime = result.timestamp;
        endTime = startTime;
        FoodCoin.new(startTime, endTime).then((result) => {
            token = result;
            return DeliveryContract.new("The Name", "The Code", token.address);
        }).then((result) => {
          delivery = result;
          done();
        });
    });
}


contract('DeliveryContract', function(accounts) {
    before('Init contracts 1', (done) => { setup(accounts, done); });

    it("should puts tokens in escrow and approve", (done) => {
        token.mintLiquidToken(accounts[0], 1000).then( () => {
            return token.balanceOf(accounts[0]);
        }).then( (balance) => {
            assert.equal(balance, 1000);
            return token.approve(delivery.address, 100);
        }).then( () => {
            return token.allowance(accounts[0], delivery.address) 
        }).then( (allowance) => {
            assert.equal(allowance, 100);
            return delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]);
        }).then(() => {
            delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67], {gas: 4000000});
        }).then(() => {
            return delivery.getParticipants()
        }).then((p) => {
            assert.equal(p[0][0], accounts[1]);
            assert.equal(p[0][1], accounts[2]);
            assert.equal(p[1][0].toNumber(), 33);
            assert.equal(p[1][1].toNumber(), 67);
            return token.balanceOf(accounts[0])
        }).then( (balance) => {
            assert.equal(balance, 900);
            return token.balanceOf(delivery.address);
        }).then( (balance) => {
            assert.equal(balance, 100);
            //Accept invitations as party 1.
            return delivery.processInvite(accounts[1], true, {from: accounts[1]});
        }).then(() => {
            // Accept invitation as party 2.
            return delivery.processInvite(accounts[2], true, {from: accounts[2]});
        }).then(() => {
            return delivery.stage()
        }).then((result) => {
            assert.equal(result, 3);
            return delivery.approve();
        }).then( () => 
            token.balanceOf(accounts[0])
        ).then( (balance) => {
            assert.equal(balance, 900);
            return token.balanceOf(accounts[1]);
        }).then( (balance) => {
            assert.equal(balance, 33);
            return token.balanceOf(accounts[2]);
        }).then( (balance) => {
            assert.equal(balance, 67);
            return token.balanceOf(delivery.address);
        }).then( (balance) => 
            assert.equal(balance, 0)
        ).then(done);
    });
});


contract('DeliveryContract', function(accounts) {

    before('Init contracts 2', (done) => { setup(accounts, done); });

    it("should puts tokens in escrow and reimburse", (done) => {
        token.mintLiquidToken(accounts[0], 1000).then( () => {
            return token.balanceOf(accounts[0])
        }).then( (balance) => {
            assert.equal(balance, 1000);
            return delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]);
        }).then( () => {
            return token.approve(delivery.address, 100);
        }).then(() => 
            token.allowance(accounts[0], delivery.address)
        ).then((allowance) => {
            assert.equal(allowance, 100);
            return delivery.inviteParticipants([accounts[1]], [100]);
        }).then( () => {
            return delivery.processInvite(0, true, {from: accounts[1]});
        }).then(() => 
            token.balanceOf(accounts[0])
        ).then( (balance) => {
            assert.equal(balance, 900);
            return token.balanceOf(delivery.address);
        }).then( (balance) => {
            assert.equal(balance, 100);
            return delivery.reimburse();
        }).then( (result) => {
            return token.balanceOf(accounts[0])
        }).then( (balance) => {
            assert.equal(balance, 1000);
            return token.balanceOf(delivery.address);
        }).then( (balance) => 
            assert.equal(balance, 0)
        ).then(done);
    });

    it("should intialize name", function(done) {
        delivery.name().then(function(name) {
            assert.equal(testutils.byte32toAscii(name), "The Name");
        }).then(done);
    });

    it("should intialize code", function(done) {
        delivery.code().then(function(code) {
            assert.equal(testutils.byte32toAscii(code), "The Code");
        }).then(done);
    });
    
});

contract('DeliveryContract', function(accounts) {

    before('Init contracts 3', (done) => { setup(accounts, done); });

    it("should set attributes", function(done) {
        delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]).then(function(result) {
            return delivery.getAttributes();
        }).then(function(attributes) {
            assert.deepEqual(testutils.byte32ArraytoAsciiArray(attributes[0]), ["Volume", "Color"]);
            assert.deepEqual(attributes[1], [new BigNumber(22), new BigNumber(768)]);
            assert.deepEqual(attributes[2], [new BigNumber(24), new BigNumber(786)]);
        }).then(done);
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

    it("should add measurements", function(done) {
        delivery.addMeasurements(["delivery", "shipping"], ["Volume", "Color"], [22, 777], [1491848127,1491848135], ["fmr01", "fmr02"], ["bch01", "bch02"]).then(function(instance) {
            return delivery.getMeasurements();
        }).then(function(measurements) {
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
        }).then(done);
    });

});
