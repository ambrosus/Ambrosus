"use strict";

const assert = require('assert');
const testutils = require("../testutils.js");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirements = artifacts.require("./protocol/Requirements/RangeRequirements.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");
const DeliveryAgreement = artifacts.require("./protocol/Agreement/DeliveryAgreement.sol");
const TokenEscrowedParties = artifacts.require("./protocol/Parties/TokenEscrowedParties.sol");
const Amber = artifacts.require("./Amber.sol");
const BigNumber = require('bignumber.js');

var amber;
var requirements;
var validator;
var parties;
var measurements;
var agreement;

let AttributeTypeInteger = 0;
let AttributeTypeBoolean = 1;


contract('DeliveryAgreement', function(accounts) {

    it('Deploy contracts', async () => {
        let result = await web3.eth.getBlock('earliest');
        let startTime = result.timestamp;

        amber = await Amber.new(startTime, startTime);
        await amber.mintLiquidToken(accounts[0], 1000);
        assert.equal(await amber.balanceOf(accounts[0]), 1000);        

        requirements = await RangeRequirements.new('aaa');        
        await requirements.setAttributes(["Volume", "Color"], [AttributeTypeInteger, AttributeTypeBoolean], [0, 0], [22, 768], [24, 786]);

        validator = await RangeValidator.new();
        measurements = await MeasurementsOnChain.new();

        agreement = await DeliveryAgreement.new(amber.address, requirements.address, validator.address, measurements.address);

        parties = TokenEscrowedParties.at(await agreement.parties());
        
        await amber.approve(parties.address, 100);
        await parties.inviteParticipants([accounts[1], accounts[2]], [33, 67]);
        await parties.acceptInvite({from: accounts[1]});
        await parties.acceptInvite({from: accounts[2]});
        await agreement.complete(true);        
        await measurements.addMeasurements(["Volume", "Color"], [22, 777], ["delivery", "shipping"], [1491848127,1491848135], ["farmer01", "famrmer02"], ["batch01", "batch02"])

        assert.equal(await amber.balanceOf(accounts[0]), 900);
        assert.equal(await amber.balanceOf(accounts[1]), 33);
        assert.equal(await amber.balanceOf(accounts[2]), 67);
    });

});

