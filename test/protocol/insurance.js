"use strict";

const assertEx = require("../testutils.js");

const Amber = artifacts.require("./Amber.sol");
const Market = artifacts.require("./protocol/Market/Market.sol");
const Offer = artifacts.require("./protocol/Market/Offer.sol");
const MeasurementsOnChain = artifacts.require("./protocol/Measurements/MeasurementsOnChain.sol");
const RangeRequirementsFactory = artifacts.require("./protocol/Requirements/RangeRequirementsFactory.sol");
const RangeValidator = artifacts.require("./protocol/Validator/RangeValidator.sol");
const EscrowedAgreement = artifacts.require("./protocol/Agreement/EscrowedAgreement.sol");
const Insurance = artifacts.require("./protocol/Insurance/Insurance.sol");

contract('Insurance', function(accounts) {
    var amber;
    var agreement;
    var insurance;
    
    var market, offer, measurements, requirements, validator;
    var buyer, seller, amberOwner, marketOwner, insuranceOwner;

    var newAgreementInsuredListener;
    var reimbursementRequestedListener;

    beforeEach("deploy contracts", async() => {
        buyer = accounts[1];
        seller = accounts[2];
        amberOwner = accounts[9];
        marketOwner = accounts[8];
        insuranceOwner = accounts[7];

        let result = await web3.eth.getBlock('earliest');
        let startTime = result.timestamp;
        amber = await Amber.new(startTime, startTime, {from: amberOwner});

        market = await Market.new(amber.address, marketOwner);
        measurements = await MeasurementsOnChain.new({from: seller});
        requirements = await RangeRequirementsFactory.new("name", market.address, {from: seller});
        validator = await RangeValidator.new(measurements.address, requirements.address, {from: seller});

        offer = await Offer.new("Fish", "Norway", "shark", "Qma", 40, 300, market.address, seller, measurements.address, requirements.address, validator.address, {from: seller});

        var amount = await offer.priceFor(42);
        await amber.mintLiquidToken(buyer, amount, {from: amberOwner});
        await amber.approve(market.address, amount, {from: buyer});

        await market.buy(offer.address, 42, {from: buyer});
        agreement = await market.getNewestAgreement({from: buyer});

        insurance = await Insurance.new(amber.address, {from: insuranceOwner});
        newAgreementInsuredListener = await insurance.NewAgreementInsured();
        reimbursementRequestedListener = await insurance.ReimbursementRequested();
    });

    describe('INSURING AGREEMENT', () => {
        it("should not insure null agreement", async() => {
            await assertEx.isReverted(async() => insurance.insure(0, 42, {from: seller}));
        });

        it("should not allow double-insurance of the same agreement", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});

            await insurance.insure(agreement, 42, {from: seller});

            // Act & assert
            await assertEx.isReverted(async() => insurance.insure(agreement, 42, {from: seller}));
        });

        it("should require non-zero premium for insurance", async() => {
            await assertEx.isReverted(async() => insurance.insure(agreement, 0, {from: seller}))
        });

        it("should charge insurance premium when insuring an agreement", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});

            // Act
            await insurance.insure(agreement, 42, {from: seller});

            // Assert
            assert.equal(42, (await amber.balanceOf(insurance.address)).toNumber());
            assert.equal(0, (await amber.balanceOf(seller)).toNumber());
        });

        it("should log insuring an agreement", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});

            // Act
            await insurance.insure(agreement, 42, {from: seller});

            // Assert
            let newAgreementInsuredLog = await new Promise(
                (resolve, reject) => newAgreementInsuredListener.get(
                    (error, log) => error ? reject(error) : resolve(log)
                ));

            assert.equal(1, newAgreementInsuredLog.length);
            let eventArgs = newAgreementInsuredLog[0].args;
            assert.equal(seller, eventArgs.beneficiary);
            assert.equal(agreement, eventArgs.agreement);
        })
    });

    describe('REQUESTING REIMBURSEMENT', () => {    
        it("should not reimburse null agreement", async() => {
            await assertEx.isReverted(async() => insurance.requestReimbursement(0, {from: seller}));
            await assertEx.isReverted(async() => insurance.reimburse(0, {from: seller}));
        });

        it("should not reimburse not-insured agreement", async() => {
            await assertEx.isReverted(async() => insurance.requestReimbursement(agreement, {from: seller}));
            await assertEx.isReverted(async() => insurance.reimburse(agreement, {from: seller}));
        });

        it ("should not reimburse rejected insurance claim", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});
            await insurance.requestReimbursement(agreement, {from: seller});
            await insurance.reject(agreement, {from: insuranceOwner});

            // Act & Assert        
            await assertEx.isReverted(async() => insurance.requestReimbursement(agreement, {from: seller}));
            await assertEx.isReverted(async() => insurance.reimburse(agreement, {from: seller}));
        });

        it("should not reimburse same agreement twice", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});
            await insurance.requestReimbursement(agreement, {from: seller});
            await insurance.approve(agreement, {from: insuranceOwner});

            var agreementAmount = await offer.priceFor(42);
            await amber.mintLiquidToken(insurance.address, agreementAmount, {from: amberOwner});
            await insurance.reimburse(agreement, {from: seller});

            // Act & Assert        
            await assertEx.isReverted(async() => insurance.requestReimbursement(agreement, {from: seller}));
            await assertEx.isReverted(async() => insurance.reimburse(agreement, {from: seller}));
        });

        it("should not reimburse to address other than beneficiary", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});

            // Act & Assert        
            await assertEx.isReverted(async() => insurance.requestReimbursement(agreement, {from: buyer}));
            await assertEx.isReverted(async() => insurance.reimburse(agreement, {from: buyer}));
        });

        it("should mark an active insurance as reimbursement requested and log event", async() => {
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});

            // Act
            await insurance.requestReimbursement(agreement, {from: seller});

            // Assert
            let status = (await insurance.insuredAgreements(agreement, {from: seller}))[0];
            const ReimbursementRequestedEnum = 2;
            assert.equal(ReimbursementRequestedEnum, status.toNumber());

            let reimbursementRequestedLog = await new Promise(
                (resolve, reject) => reimbursementRequestedListener.get(
                    (error, log) => error ? reject(error) : resolve(log)
                ));

            assert.equal(1, reimbursementRequestedLog.length);
            let eventArgs = reimbursementRequestedLog[0].args;
            assert.equal(seller, eventArgs.requestor);
            assert.equal(agreement, eventArgs.agreement);
        });

        it("should reimburse approved insurance claim", async() => {
            // Arrange
            const insurancePremium = 65;
            await amber.mintLiquidToken(seller, insurancePremium, {from: amberOwner});
            await amber.approve(insurance.address, insurancePremium, {from: seller});
            await insurance.insure(agreement, insurancePremium, {from: seller});
            await insurance.requestReimbursement(agreement, {from: seller});
            await insurance.approve(agreement, {from: insuranceOwner});

            var agreementAmount = await offer.priceFor(42);
            await amber.mintLiquidToken(insurance.address, agreementAmount, {from: amberOwner});

            // Act
            await insurance.reimburse(agreement, {from: seller});

            // Assert  
            assert.equal(agreementAmount, (await amber.balanceOf(seller)).toNumber());
            assert.equal(insurancePremium, (await amber.balanceOf(insurance.address)).toNumber());

            let status = (await insurance.insuredAgreements(agreement, {from: seller}))[0];
            const Complete = 5;
            assert.equal(Complete, status.toNumber());
        });
    });

    describe('MANAGING INSURANCE CLAIMS', () => {
        it("should allow insurance owner to reject claims", async() =>{
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});
            await insurance.requestReimbursement(agreement, {from: seller});

            // Act
            await insurance.reject(agreement, {from: insuranceOwner});

            // Assert        
            let status = (await insurance.insuredAgreements(agreement, {from: seller}))[0];
            const ReimbursementRejected = 4;
            assert.equal(ReimbursementRejected, status.toNumber());
        });

        it("should not allow rejecting not-requested claims", async() =>{
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});

            // Act & Assert
            await assertEx.isReverted(async() => await insurance.reject(agreement, {from: insuranceOwner}));
        });

        it("should allow insurance owner to approve claims", async() =>{
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});
            await insurance.requestReimbursement(agreement, {from: seller});

            // Act
            await insurance.approve(agreement, {from: insuranceOwner});

            // Assert        
            let status = (await insurance.insuredAgreements(agreement, {from: seller}))[0];
            const ReimbursementApproved = 3;
            assert.equal(ReimbursementApproved, status.toNumber());
        });

        it("should not allow approving not-requested claims", async() =>{
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});

            // Act & Assert
            await assertEx.isReverted(async() => await insurance.approve(agreement, {from: insuranceOwner}));
        });

        it("should not allow non-owner to approve/reject claims", async() =>{
            // Arrange
            await amber.mintLiquidToken(seller, 42, {from: amberOwner});
            await amber.approve(insurance.address, 42, {from: seller});
            await insurance.insure(agreement, 42, {from: seller});
            await insurance.requestReimbursement(agreement, {from: seller});

            // Act & Assert
            await assertEx.isReverted(async() => await insurance.reject(agreement, {from: buyer}));
            await assertEx.isReverted(async() => await insurance.reject(agreement, {from: seller}));
            await assertEx.isReverted(async() => await insurance.approve(agreement, {from: buyer}));
            await assertEx.isReverted(async() => await insurance.approve(agreement, {from: seller}));
        });
    });
});
