"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const BigNumber = require('bignumber.js');

var requirements;

contract('RangeRequirements', function(accounts) {

    it('Deploy contract', async () => {
		requirements = await RangeRequirements.new();
    });

    it("should set attributes", async () => {
        await requirements.setAttributes(["Volume", "Color"], [0, 0], [3, 6], [22, 768], [24, 786]);
        var attributes = await requirements.getAttributes();
        assert.deepEqual(testutils.byte32ArraytoAsciiArray(attributes[0]), ["Volume", "Color"]);
        assert.deepEqual(attributes[3], [new BigNumber(22), new BigNumber(768)]);
        assert.deepEqual(attributes[4], [new BigNumber(24), new BigNumber(786)]);
    });

});

