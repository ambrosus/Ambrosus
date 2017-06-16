"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const BigNumber = require('bignumber.js');
const MockToken = artifacts.require("../Utils/MockToken.sol");
const TokenEscrowedParties = artifacts.require("./protocol/Parties/TokenEscrowedParties.sol");

var foodCoin;
var parties;

contract('RangeValidator', function(accounts) {

    it('Deploy contracts', async () => {
		
    });

    it('invites, escrows and approves', async () => {
        foodCoin = await MockToken.new([accounts[0]], [300]);
		parties = await TokenEscrowedParties.new(foodCoin.address);

		await foodCoin.approve(parties.address, 300);
		await parties.inviteParticipants([accounts[1], accounts[2]], [100, 200]);
		assert.deepEqual(await foodCoin.balanceOf(parties.address), new BigNumber(300));

		var result = await parties.getParticipants();		
		assert.deepEqual(result[0],[accounts[1], accounts[2]]);
		assert.deepEqual(result[1], [new BigNumber(100), new BigNumber(200)]);

		await parties.approve();
		assert.deepEqual(await foodCoin.balanceOf(accounts[1]), new BigNumber(100));
		assert.deepEqual(await foodCoin.balanceOf(accounts[2]), new BigNumber(200));
    });

    it('invites, escrows and reimburses', async () => {
    	foodCoin = await MockToken.new([accounts[0]], [300]);
    	parties = await TokenEscrowedParties.new(foodCoin.address);

		await foodCoin.approve(parties.address, 300);
		await parties.inviteParticipants([accounts[1], accounts[2]], [100, 200]);
		assert.deepEqual(await foodCoin.balanceOf(parties.address), new BigNumber(300));

		var result = await parties.getParticipants();		
		assert.deepEqual(result[0],[accounts[1], accounts[2]]);
		assert.deepEqual(result[1], [new BigNumber(100), new BigNumber(200)]);

		await parties.reimburse();
		assert.deepEqual(await foodCoin.balanceOf(accounts[0]), new BigNumber(300));
    });

});

