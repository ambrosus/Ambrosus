"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const BigNumber = require('bignumber.js');
const MockToken = artifacts.require("../Utils/MockToken.sol");
const TokenEscrowedParties = artifacts.require("./protocol/Parties/TokenEscrowedParties.sol");

var amber;
var parties;

let StateNew = 0;
let StateInvited = 1;
let StateLocked = 2;
let StateApproved = 3;
let StateReimbursed = 4;

contract('RangeValidator', function(accounts) {

	beforeEach("deploy contracts", async() => {
        amber = await MockToken.new([accounts[0]], [300]);
		parties = await TokenEscrowedParties.new(amber.address);
		assert.equal(await parties.state(), StateNew);

		await amber.approve(parties.address, 300);
		await parties.inviteParticipants([accounts[1], accounts[2]], [100, 200]);
		assert.equal(await parties.state(), StateInvited);
	});

    it('Approve only in lock state (invited, 0 approved)', async () => {
    	try {
    		await parties.approve();
    		assert.fail("parties.approve should throw an excpetion in this state");
    	} catch (e) {						
    	}
    });

    it('Approve only in lock state (invited, not enough approved)', async () => {
    	try {
    		await parties.approve();
    		await parties.acceptInvite({from: accounts[1]});
    		assert.equal(await parties.state(), StateInvited);
    		assert.fail("parties.approve should throw an excpetion in this state");
    	} catch (e) {						
    	}
    });

    it ('gets participants', async () => {
		var result = await parties.getParticipants();		
		assert.deepEqual(result[0],[accounts[1], accounts[2]]);
		assert.deepEqual(result[1], [new BigNumber(100), new BigNumber(200)]);
    });

    it('invites, escrows and approves', async () => {
        await parties.acceptInvite({from: accounts[1]});
        await parties.acceptInvite({from: accounts[2]});
        assert.equal(await parties.state(), StateLocked);
		
		await parties.approve();
		assert.deepEqual(await amber.balanceOf(accounts[1]), new BigNumber(100));
		assert.deepEqual(await amber.balanceOf(accounts[2]), new BigNumber(200));
		assert.equal(await parties.state(), StateApproved);
    });

    it('invites, escrows and reimburses', async () => {
        await parties.acceptInvite({from: accounts[1]});
        await parties.acceptInvite({from: accounts[2]});
        assert.equal(await parties.state(), StateLocked);

		await parties.reimburse();
		assert.deepEqual(await amber.balanceOf(accounts[0]), new BigNumber(300));
		assert.equal(await parties.state(), StateReimbursed);
    });

});

