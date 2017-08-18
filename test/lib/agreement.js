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
    market = await (new MarketRepository()).create();
    offer = await (new OfferRepository()).save(market.marketContract.address, testOffer);
    var agreementRepo = new AgreementRepository(market.getAddress(), AgreementArtifacts);
    token = Token.at(await market.marketContract.token());
    token.chargeMyAccount(1000);
    await agreementRepo.initiateAgreement(offer.address, 3);
    var profile = await new ProfileRepository().getMyProfileFromMarket(market.getAddress());
    var agreementAddress = (await agreementRepo.getUserAgreements(profile.getAddress()))[0].address;
    agreement = await agreementRepo.fromAddress(agreementAddress);
    agreementContract = agreement.agreementContract;
  });

  it('should setup buyer & seller', async () => {
    assert.deepEqual(await agreementContract.buyer(), accounts[0]);
    assert.deepEqual(await agreementContract.seller(), accounts[1]);
  });

  it('should escrow', async () => {
    assert.equal(await token.balanceOf(accounts[0]), 400);
    assert.equal(await token.balanceOf(agreementContract.address), 600);
  });

  it('should catch if not enough tokens', async () => {
    agreementRepo = new AgreementRepository(market.getAddress(), AgreementArtifacts);
    await testUtils.expectThrow(agreementRepo.initiateAgreement(offer.address, PACKAGE_COUNT_TOO_MANY));
  });

  it('should accept agreement', async () => {
    await agreement.accept();

    assert.equal(await token.balanceOf(accounts[0]), 400);
    assert.equal(await token.balanceOf(accounts[1]), 600);
  });

  it('should reject agreement', async () => {
    await agreement.reject();

    assert.equal(await token.balanceOf(accounts[0]), 1000);
    assert.equal(await token.balanceOf(accounts[1]), 0);
  });

  it('should get all users agreements', async () => {
    var agreementRepo = new AgreementRepository(market.getAddress(), AgreementArtifacts);
    await agreementRepo.initiateAgreement(offer.address, 1);

    var profile = await new ProfileRepository().getMyProfileFromMarket(market.getAddress());
    
    var myAgreements = await new AgreementRepository().getUserAgreements(profile.getAddress());
    assert.equal(myAgreements.length, 2)
  })
});
