'use strict';
const Market = require('./Market.js');

class MarketRepository {

  constructor(_MarketContract) {
    this.MarketContract = _MarketContract;
  }

  async create(creator) {
    var market = new Market();
    market.marketContract = await this.MarketContract.new({from: creator});
    return market;
  }

  async fromAddress(marketAddress) {
    var market = new Market();
    market.marketContract = await this.MarketContract.at(marketAddress);
    return market;
  }
}

module.exports = MarketRepository;
