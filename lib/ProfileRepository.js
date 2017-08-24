const promisify = require("es6-promisify");
const MarketRepository = require('./MarketRepository');
const Profile = require('./Profile');
const utils = require('./web3-utils');

const DEPLOY_GAS_LIMIT = 1500000;

class ProfileRepository {

  constructor(profileJSON = require('../build/contracts/Profile.json')) {
    this.ProfileContract = web3.eth.contract(profileJSON.abi);
  }

  fromAddress(profileAddress) {
    return new Profile(this.ProfileContract.at(profileAddress));
  }

  async getMyProfileFromMarket(marketAddress) {
    var marketRepository = new MarketRepository();
    var market = await marketRepository.fromAddress(marketAddress);
    var profileAddress = await promisify(market.marketContract.getMyProfile)({from: web3.eth.accounts[0]});

    return this.fromAddress(profileAddress);
  }

  async setUserName(marketAddress, name, transactionHashCallback) {
    var marketRepository = new MarketRepository();
    var market = await marketRepository.fromAddress(marketAddress);
    var tx = await promisify(market.marketContract.setUserName)(name, {from: web3.eth.accounts[0], gas: DEPLOY_GAS_LIMIT});
    if (transactionHashCallback) {
      transactionHashCallback(tx);
    }
    await utils.waitForTransaction(tx, DEPLOY_GAS_LIMIT);
    return tx;
  }
}

module.exports = ProfileRepository;