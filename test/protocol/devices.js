"use strict";

const testutils = require("../testutils.js");
const BigNumber = require('bignumber.js');
const Devices = artifacts.require("./protocol/Devices.sol");

var devices;

contract('Devices', function(accounts) {

    it('Store list of device addresses', async () => {
		devices = await Devices.new([accounts[1], accounts[2]]);
		assert.isOk(await devices.containsDevice(accounts[1]));
		assert.isOk(await devices.containsDevice(accounts[2]));
		assert.isNotOk(await devices.containsDevice(accounts[0]));
    });

});

