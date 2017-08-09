const Token = artifacts.require("./protocol/Utils/MockToken.sol");
const OfferRepository = require('../../lib/OfferRepository.js');
const MarketRepository = require('../../lib/MarketRepository.js');
const MarketArtifacts = artifacts.require("./protocol/Market/Market.sol");
const OfferArtifacts = artifacts.require("./protocol/Market/Offer.sol");
const AgreementArtifacts = artifacts.require('./protocol/Agreement/EscrowedAgreement.sol');
const Agreement = require('../../lib/Agreement');
const testUtils = require('../testutils.js');
const PACKAGE_COUNT_TOO_MANY = 10000000000000;

contract('Agreement Interface', function(accounts) {
  var delivery, token, offer, market;

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
    market = await (new MarketRepository(MarketArtifacts)).create(accounts[0]);
    offer = await (new OfferRepository(OfferArtifacts)).save(market.marketContract.address, testOffer);
    token = await Token.new([web3.eth.accounts[0]], [1000]);
    agreement = new Agreement(offer.address, 3, token.address, AgreementArtifacts, Token);
  });

  it('should setup buyer & seller', async () => {
    var agreementContract = await agreement.initiateAgreement();

    assert.deepEqual(await agreementContract.buyer(), accounts[0]);
    assert.deepEqual(await agreementContract.seller(), accounts[1]);
  });

  it('should escrow', async () => {
    var agreementContract = await agreement.initiateAgreement();

    assert.equal(await token.balanceOf(accounts[0]), 400);
    assert.equal(await token.balanceOf(agreementContract.address), 600);
  });

  it('should catch if not enough tokens', async () => {
    agreement = new Agreement(offer.address, PACKAGE_COUNT_TOO_MANY, token.address, AgreementArtifacts, Token);
    await testUtils.expectThrow(agreement.initiateAgreement());
  });

  it('should accept agreement', async () => {
    var agreementContract = await agreement.initiateAgreement();
    await agreement.accept(agreementContract);

    assert.equal(await token.balanceOf(accounts[0]), 400);
    assert.equal(await token.balanceOf(accounts[1]), 600);
  });

  it('should reject agreement', async () => {
    var agreementContract = await agreement.initiateAgreement();
    await agreement.reject(agreementContract);

    assert.equal(await token.balanceOf(accounts[0]), 1000);
    assert.equal(await token.balanceOf(accounts[1]), 0);
  });
});