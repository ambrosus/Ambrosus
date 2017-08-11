const Token = artifacts.require("./protocol/Utils/MockToken.sol");
const OfferRepository = require('../../lib/OfferRepository.js');
const MarketRepository = require('../../lib/MarketRepository.js');
const MarketArtifacts = artifacts.require("./protocol/Market/Market.sol");
const OfferArtifacts = artifacts.require("./protocol/Market/Offer.sol");
const AgreementArtifacts = artifacts.require('./protocol/Agreement/EscrowedAgreement.sol');
const AgreementRepository = require('../../lib/AgreementRepository.js');
const ProfileRepository = require('../../lib/ProfileRepository');
const testUtils = require('../testutils.js');

const PACKAGE_COUNT_TOO_MANY = 10000000000000;


contract('Agreement Interface', function(accounts) {
  var delivery, token, offer, market, agreementContract;

  let testOffer = {
    name: 'AAA',
    origin: 'BBB',
    category: 'Fish',
    packageWeight: 200,
    pricePerUnit: 100,
    pricePerPackage: 200,
    imageHash: 'QmVPMUYVooLw9XRgEWFnKZLyaZeWBM18EX7X3g6hrQBDqB',
    seller: web3.eth.accounts[1],
    measurementsAddress: accounts[1],
    requirementsAddress: accounts[1],
  };

  beforeEach(async () => {
    market = await (new MarketRepository(MarketArtifacts)).create();
    offer = await (new OfferRepository(OfferArtifacts)).save(market.marketContract.address, testOffer);
    token = await Token.new([web3.eth.accounts[0]], [1000]);
    var agreementRepo = new AgreementRepository(token.address, market.getAddress(), AgreementArtifacts, Token);
    agreement = await agreementRepo.initiateAgreement(offer.address, 3);
    agreementContract = agreement.agreementContract;

  });

  it('should setup buyer & seller', async () => {
    assert.deepEqual(await agreementContract.buyer(), accounts[0]);
    assert.deepEqual(await agreementContract.seller(), accounts[1]);
  });

  it('should escrow', async () => {
    await agreement.transfer();
    assert.equal(await token.balanceOf(accounts[0]), 400);
    assert.equal(await token.balanceOf(agreementContract.address), 600);
  });

  it('should catch if not enough tokens', async () => {
    agreementRepo = new AgreementRepository(token.address, market.getAddress(), 
                                            AgreementArtifacts, Token);
    agreement = await agreementRepo.initiateAgreement(offer.address, PACKAGE_COUNT_TOO_MANY);
    await testUtils.expectThrow(agreement.transfer());
  });

  it('should accept agreement', async () => {
    await agreement.transfer();
    await agreement.accept();

    assert.equal(await token.balanceOf(accounts[0]), 400);
    assert.equal(await token.balanceOf(accounts[1]), 600);
  });

  it('should reject agreement', async () => {
    await agreement.transfer();
    await agreement.reject();

    assert.equal(await token.balanceOf(accounts[0]), 1000);
    assert.equal(await token.balanceOf(accounts[1]), 0);
  });

  it('should get all users agreements', async () => {
    await agreement.transfer();
    var agreementRepo = new AgreementRepository(token.address, market.getAddress(), 
                                                AgreementArtifacts, Token);
    agreement = await agreementRepo.initiateAgreement(offer.address, 1);
    await agreement.transfer();

    var profile = await new ProfileRepository().getInMarket(market.getAddress());
    var myAgreements = await new AgreementRepository().getAllUserAgreements(profile.getAddress());

    assert.equal(myAgreements.length, 2)
  })
});
