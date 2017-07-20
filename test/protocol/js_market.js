const Market = require("../../lib/Market.js");
const Offer = require('../../lib/Offer.js');
const OfferFactory= require('../../lib/OfferFactory.js');
const MarketFactory= require('../../lib/MarketFactory.js');
const MarketContract = artifacts.require("./protocol/Market/Market.sol");
const OfferContract = artifacts.require("./protocol/Market/Offer.sol");


contract('Market', function(accounts) {
  
  let testOffer = {
          name:'AAA',
          origin: 'BBB',
          packageWeight: 100,
          pricePerUnit: 100,
          pricePerPackage: 100,
          imageHash: 'Qmsadasdasdasdsadas',
          seller: accounts[0],
          measurementsAddress: accounts[1],
          requirementsAddress: accounts[1],
          validatorAddress: accounts[1],
        };
 
    it('should add and get offer', async () => {
        var market = await new MarketFactory(MarketContract).create(accounts[0]);
    await new OfferFactory(OfferContract).saveOffer(market.getMarketAddress(), testOffer);
        var offers = await market.getOffers(new OfferFactory(OfferContract));

        assert.deepEqual(offers[0], testOffer);
    });

    it('should get contract from address', async () => {
      var market = await new MarketFactory(MarketContract).create(accounts[0]);
        await new OfferFactory(OfferContract).saveOffer(market.getMarketAddress(), testOffer);
        var market2 = await new MarketFactory(MarketContract).createFromAddress(market.getMarketAddress());

        var offers = await market.getOffers(new OfferFactory(OfferContract));
        var offers2 = await market.getOffers(new OfferFactory(OfferContract));

        assert.deepEqual(offers, offers2);
    });

    it('should work with partial information', async () => {
      var market = await new MarketFactory(MarketContract).create(accounts[0]);
      await new OfferFactory(OfferContract).saveOffer(market.getMarketAddress(), {name: 'aaa', seller: accounts[0]})

        var offers = await market.getOffers(new OfferFactory(OfferContract));

      assert.equal(offers[0].name, 'aaa');
    })

});
