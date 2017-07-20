'use strict';
const Offer = require('./Offer.js');
const Market = require('./Market.js');

class OfferFactory {

  constructor(_MarketContract) {
    this.MarketContract = _MarketContract;
  }

  async create(creator){
    var market = new Market();
    market.marketContract = await this.MarketContract.new({from: creator});
    return market;
  }

  async createFromAddress(marketAddress){
    var market = new Market();
    market.marketContract = await this.MarketContract.at(marketAddress);
    return market;
  }
}

module.exports = OfferFactory;