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

  async getInMarket(marketAddress) {
    var marketRepository = new MarketRepository();
    var market = await marketRepository.fromAddress(marketAddress);
    var profileAddress = await market.marketContract.getMyProfile();

    return this.fromAddress(profileAddress);
  }
}

module.exports = ProfileRepository;