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

    it("Throws an exception if invitingParticipants at wrong stage", (done) => {
        testutils.expectedExceptionPromise(function () {
            return delivery.inviteParticipants.sendTransaction([accounts[1], accounts[2]], [33, 67]
                , {gas: 4000000});
        }, 4000000).then(done);
    });

    it("Advance stages", (done) => {
        token.grant(accounts[0], 1000).then( () => {
            delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786])
        }).then(() => {
            token.approve(delivery.address, 1000);
        }).then((result) => {
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

