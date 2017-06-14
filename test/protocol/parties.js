"use strict";

const testutils = require("../testutils.js");
const BigNumber = require('bignumber.js');
const Parties = artifacts.require("./protocol/Parties/Parties.sol");

var parties;

contract('RangeValidator', function(accounts) {

    it('Deploy contracts', async () => {
		var parties = await Parties.new();
		await parties.inviteParticipants([accounts[0], accounts[1]], [1000, 2000]);
		var result = await parties.getParticipants();		
		assert.deepEqual(result[0],[accounts[0], accounts[1]]);
		assert.isOk(result[1][0].equals(new BigNumber(1000)));
		assert.isOk(result[1][1].equals(new BigNumber(2000)));
    });

});

