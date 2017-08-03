"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const Market = artifacts.require("./protocol/Market/Market.sol");
const BigNumber = require('bignumber.js');

var requirements;

contract('RangeRequirements', function(accounts) {

    it('Deploy contract', async () => {
		requirements = await RangeRequirements.new("", (await Market.new()).address);
        await requirements.setAttributes(["Volume", "Color"], [0, 0], [3, 6], [22, 768], [24, 786]);
    });

    it("should set & get attributes", async () => {        
        var attributes = await requirements.getAttributes();
        assert.deepEqual(testutils.byte32ArraytoAsciiArray(attributes[0]), ["Volume", "Color"]);
        assert.deepEqual(attributes[3], [new BigNumber(22), new BigNumber(768)]);
        assert.deepEqual(attributes[4], [new BigNumber(24), new BigNumber(786)]);
    });


    it("should get attribute by id", async () => {
        var attribute = await requirements.getAttributeById("Color");
        assert.equal(testutils.byte32toAscii(attribute[0]), "Color");
        assert.equal(attribute[2], 6);
        assert.equal(attribute[3], 768);
        assert.equal(attribute[4], 786);
    });

});

