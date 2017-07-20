'use strict';
const Market = require('./Market.js');

class MarketFactory {

  constructor(_MarketContract) {
    this.MarketContract = _MarketContract;
  }

  async create(creator) {
    var market = new Market();
    market.marketContract = await this.MarketContract.new({from: creator});
    return market;
  }

  async getAtAddress(marketAddress) {
    var market = new Market();
    market.marketContract = await this.MarketContract.at(marketAddress);
    return market;
  }
}

module.exports = MarketFactory;
