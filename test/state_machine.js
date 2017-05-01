"use strict";

const DeliveryContract = artifacts.require("./DeliveryContract.sol");
const FoodToken = artifacts.require("./FoodToken.sol");
const assert = require('assert');
const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let delivery;

let token;

function setup(accounts) {
  DeliveryContract.deployed().then((deployed) => delivery = deployed );
  FoodToken.deployed().then((deployed) => token = deployed);
}

contract('DeliveryContract', function(accounts) {
    before('Init contracts', (done) => { setup(accounts); done(); });

    it("should listen to state machine", (done) => {
        delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67])
        .then(() => {
            return delivery.getParticipants()
        }).then((result) => {
            assert.equal(result[0].length, 0); // I.E. nothing was found [ [], [] ]
        })

        // Test HasAttribute is enforced.
        .then(() => {
            return delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786])
        }).then(() => {
            return delivery.stage();
        }).then((result) => {
            assert.equal(result, 1);
        }).then(() => {
            return delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67]);
        }).then(() => {
            return delivery.getParticipants();
        }).then((result) => {
            assert.equal(result[0][0], accounts[1]);
        }).then(done);

    });
});

