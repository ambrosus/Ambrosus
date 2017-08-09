const promisify = require("es6-promisify");

const Market = require('./Market.js');

const DEPLOY_GAS_LIMIT = 1500000;
const DEFAULT_BALANCE = 1000000;

class MarketRepository {

  constructor(
      marketJSON = require('../build/contracts/Market.json'),
      marketFactoryJSON = require('../build/contracts/MarketFactory.json')) {
    this.MarketContract = web3.eth.contract(marketJSON.abi);
    this.MarketFactoryContract = web3.eth.contract(marketFactoryJSON.abi);
    this.data = marketFactoryJSON.unlinked_binary;
  }

  create(amount = DEFAULT_BALANCE, transactionHashCallback) {
    var transactionParams = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    var self = this;

    return new Promise((resolve, reject) => {
      var market = new Market();
      this.MarketFactoryContract.new(amount, transactionParams, async (err, factoryContract) => {
        if (err) {
          reject(err);
        } else if (!factoryContract.address && transactionHashCallback) {
          transactionHashCallback(factoryContract.transactionHash);
        } else if (factoryContract.address){          
          resolve(await self.fromAddress(await promisify(factoryContract.market)()));
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