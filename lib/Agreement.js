const promisify = require("es6-promisify");
const utils = require('./web3-utils');
const ProfileRepository = require('./ProfileRepository');
const OfferRepository = require('./OfferRepository');

const DEPLOY_GAS_LIMIT = 1500000;

class Agreement {

  constructor(contract, marketAddress) {
    this.agreementContract = contract;
    this.marketAddress = marketAddress;
  }

  async accept() {
    await promisify(this.agreementContract.approve)({from: web3.eth.accounts[0]});
  }

  async reject() {
    await promisify(this.agreementContract.reimburse)({from: web3.eth.accounts[0]});
  }

  async getData() {
    return {
      offer: await new OfferRepository().fromAddress(await this.agreementContract.offer()),
      amount: web3.toDecimal(await this.agreementContract.amount()),
      quantity: web3.toDecimal(await this.agreementContract.quantity()),
      seller: await this.agreementContract.seller(),
      address: this.agreementContract.address,
    }
  }
}

module.exports = Agreement;
