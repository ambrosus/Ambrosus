const promisify = require("es6-promisify");

const MarketRepository = require('./MarketRepository');
const Profile = require('./Profile');


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

  async setUserName(marketAddress, name) {
    var marketRepository = new MarketRepository();
    var market = await marketRepository.fromAddress(marketAddress);
    await promisify(market.marketContract.setUserName)(name, {from: web3.eth.accounts[0]});
  }
}

module.exports = ProfileRepository;