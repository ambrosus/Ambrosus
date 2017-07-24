'use strict';
const Market = require('./Market.js');

const DEPLOY_GAS_LIMIT = 500000;

class MarketRepository {

  constructor(_MarketContract) {
    this.MarketContract = _MarketContract;
  }

  async create(creator) {
    var market = new Market();
    market.marketContract = await this.MarketContract.new({from: creator, gas: DEPLOY_GAS_LIMIT});
    return market;
  }

  async fromAddress(marketAddress) {
    var market = new Market();
    market.marketContract = await this.MarketContract.at(marketAddress);
    return market;
  }
}

module.exports = MarketRepository;
