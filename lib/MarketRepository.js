'use strict';
const Market = require('./Market.js');

const DEPLOY_GAS_LIMIT = 500000;

class MarketRepository {

  constructor(MarketJSON = artifacts.require("../contract/protocol/Market/Market.sol")) {
    this.MarketContract = web3.eth.contract(MarketJSON.abi);
    this.data = MarketJSON.unlinked_binary;
  }

  create(creator, transactionHashCallback) {
    var tx = {
      from: creator,
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    return new Promise((resolve, reject) => {
      var market = new Market();
      this.MarketContract.new(tx, (err, newContract) => {
        if (err) {
          reject(err);
        } else if (!newContract.address && transactionHashCallback) {
          transactionHashCallback(newContract.transactionHash);
        } else if (newContract.address){
          market.marketContract = newContract;
          resolve(market);
        }
      });
    });
  }

  async fromAddress(marketAddress) {
    var market = new Market();
    market.marketContract = await this.MarketContract.at(marketAddress);
    return market;
  }
}

module.exports = MarketRepository;