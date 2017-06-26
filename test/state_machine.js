"use strict";

const DeliveryContract = artifacts.require("./DeliveryContract.sol");
const Qualit = artifacts.require("./Qualit.sol");
const assert = require('assert');
const testutils = require("./testutils.js");
const BigNumber = require('bignumber.js');

let delivery;

let token;

async function setup(accounts, done) {
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
    before('Init contracts', (done) => { setup(accounts, done); });

    it("Throws an exception if invitingParticipants at wrong stage", (done) => {
        testutils.expectedExceptionPromise(function () {
            return delivery.inviteParticipants.sendTransaction([accounts[1], accounts[2]], [33, 67]
                , {gas: 4000000});
        }, 4000000).then(done);
    });

    it("Advance stages", async () => {
        await token.mintLiquidToken(accounts[0], 1000);
        await delivery.setAttributes(["Volume", "Color"], [22, 768], [24, 786]);
        await token.approve(delivery.address, 1000);
        assert.equal(await delivery.stage(), 1);
        await delivery.inviteParticipants([accounts[1], accounts[2]], [33, 67]);
        var result = await delivery.getParticipants();
        assert.equal(result[0][0], accounts[1]);
    });
});

