"use strict";

const DeliveryContract = artifacts.require("./DeliveryContract.sol");
const FoodToken = artifacts.require("./FoodToken.sol");
const assert = require('assert');
const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let delivery;
let token;

contract('DeliveryContract', function(accounts) {

  before('Init contract instances', () => {
    DeliveryContract.deployed("The Name", "The Code").then((deployed) => { delivery = deployed; });
    FoodToken.deployed().then((deployed) => { token = deployed; });
  });

  it("should escrow tokens for delivery", () => {
    token.approve(delivery.address, 100).then(() => {
        token.allowance(accounts[0], delivery.address)
      .then((allowance) => {
        assert.equal(allowance, 100);
        return delivery.inviteParticipants(100);
      }).then((balance) => {
        token.allowance(accounts[0], delivery.address).then( (allowance) => assert.equal(allowance, 0));
        return token.balanceOf(delivery.address);
      }).then((balance) => {
        assert.equal(balance, 100);
        return delivery.reimburse();
      }).then(() => {
        token.balanceOf(accounts[0]).then( (balance) => assert.equal(balance, 1000));
        token.balanceOf(delivery.address).then( (balance) => assert.equal(balance, 0));
      });
    });
  });

  it("should intialize name", function() {
    return delivery.name().then(function(name) {
      assert.equal(testutils.byte32toAscii(name), "The Name");
    });
  });

  it("should intialize code", function() {
    return delivery.code().then(function(code) {
      assert.equal(testutils.byte32toAscii(code), "The Code");
    });
  });

  it("should set attributes", function() {
    return delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]).then(function(result) {
      return delivery.getAttributes();
    }).then(function(attributes) {
      assert.deepEqual(testutils.byte32ArraytoAsciiArray(attributes[0]), ["Volume", "Color"]);
      assert.deepEqual(attributes[1], [new BigNumber(22), new BigNumber(768)]);
      assert.deepEqual(attributes[2], [new BigNumber(24), new BigNumber(786)]);
    })
  });

  it("set attributes should throw when arguments are arrays of different size", function() {
    return testutils.expectedExceptionPromise(function () {
      return delivery.setAttributes.sendTransaction(["Volume", "Color"], [22], [21], {gas: 4000000});
    }, 4000000);
  });

  it("add measurements should throw when arguments are arrays of different size", function() {
    return testutils.expectedExceptionPromise(function () {
      return delivery.reportMultiple.sendTransaction(
        ["delivery", "shipping"], ["Volume", "Color"], [22], [1491848127,1491848135], ["fmr01", "fmr02"], ["bch01", "bch02"]
        , {gas: 4000000});
    }, 4000000);
  });

  it("should add measurements", function() {
    return delivery.reportMultiple(["delivery", "shipping"], ["Volume", "Color"], [22, 777], [1491848127,1491848135], ["fmr01", "fmr02"], ["bch01", "bch02"]).then(function(instance) {
      return delivery.getReports();
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
    })
  });

});
