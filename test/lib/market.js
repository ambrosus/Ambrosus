const Market = require("../../lib/Market.js");
const Offer = require('../../lib/Offer.js');
const OfferRepository = require('../../lib/OfferRepository.js');
const MarketRepository = require('../../lib/MarketRepository.js');
const MarketArtifacts = artifacts.require("./protocol/Market/Market.sol");
const OfferArtifacts = artifacts.require("./protocol/Market/Offer.sol");

contract('Market Interface', function(accounts) {
  var offerRepo, marketRepo, market;
  
  let testOffer = {
    name: 'AAA',
    origin: 'BBB',
    category: 'Fish',
    packageWeight: 200,
    pricePerUnit: 100,
    pricePerPackage: 200,
    imageHash: 'QmVPMUYVooLw9XRgEWFnKZLyaZeWBM18EX7X3g6hrQBDqB',
    seller: accounts[0],
    measurementsAddress: accounts[1],
    requirementsAddress: accounts[1],
    validatorAddress: accounts[1],
    quality: '',
  };

  beforeEach(async ()=>{
    offerRepo = new OfferRepository(OfferArtifacts);
    marketRepo = new MarketRepository(MarketArtifacts);
    market = await marketRepo.create(accounts[0]);
  })

  it('should add and get offer', async () => {   
    await offerRepo.save(market.getAddress(), testOffer);

    var offers = await offerRepo.getAllFromMarket(market);
    delete offers[0].address
    
    assert.deepEqual(offers[0], testOffer);
  });

  it('should get contract from address', async () => {
    await offerRepo.save(market.getAddress(), testOffer);
    var market2 = await marketRepo.fromAddress(market.getAddress());

    var offers = await offerRepo.getAllFromMarket(market);
    var offers2 = await offerRepo.getAllFromMarket(market2);

    assert.deepEqual(offers, offers2);
  });

  it('should work with partial information', async () => {
    await offerRepo.save(market.getAddress(), {origin: 'aaa', seller: accounts[0]});

    var offers = await offerRepo.getAllFromMarket(market);

    assert.equal(offers[0].origin, 'aaa');
  });
});
