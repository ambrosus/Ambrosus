const promisify = require("es6-promisify");
const Agreement = require('./Agreement');
const ProfileRepository = require('./ProfileRepository');
const MarketRepository = require('./MarketRepository');
const OfferRepository = require('./OfferRepository');
const TokenSingleton = require('./TokenSingleton');
const utils = require('./web3-utils');

const DEPLOY_GAS_LIMIT = 3500000;

class AgreementRepository {

  constructor(marketAddress, agreementJSON = require('../build/contracts/EscrowedAgreement.json')) {
    this.AgreementContract = web3.eth.contract(agreementJSON.abi);
    this.data = agreementJSON.unlinked_binary;
    this.marketAddress = marketAddress;
  }

  initiateAgreement(offerAddress, quantity, transactionHashCallback) {
    const transactionParams = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
    }
    return new Promise(async (resolve, reject) => {
      try {
        var marketContract = (await new MarketRepository().fromAddress(this.marketAddress)).marketContract;
        var tokenAddress = await promisify(marketContract.token)();
        var token = (await new TokenSingleton().fromAddress(tokenAddress)).contract;
        var offer = new OfferRepository().OfferContract.at(offerAddress);
        var amount = await promisify(offer.priceFor)(quantity);
        await promisify(token.approve)(this.marketAddress, amount, { from: web3.eth.accounts[0] });
      } catch (e) {
        reject(e);
      }
      marketContract.buy(offerAddress, quantity, transactionParams,
        async (err, tx) => {
          if (err) {
            reject(err);
          } else {
            if (transactionHashCallback) {
              transactionHashCallback(tx);
            }
            try {
              await utils.waitForTransaction(tx, DEPLOY_GAS_LIMIT);
            } catch(err) {
              reject(err);
            }
            resolve(tx);
          }
        });
    });
  }

  async fromAddress(agreementAddress) {
    var contract = this.AgreementContract.at(agreementAddress);
    return new Agreement(contract, this.marketAddress);
  }

  async getUserAgreements(profileAddress) {
    var profileContract = new ProfileRepository().fromAddress(profileAddress).profileContract;
    var count = await profileContract.agreementsCount({ from: web3.eth.accounts[0] });
    var agreements = [];
    for (let i = 0; i < count; i++) {
      var agreementAddress = await promisify(profileContract.agreementAt)(i);
      var agreement = await this.fromAddress(agreementAddress);
      agreements.push(await agreement.getData());
    }
    return agreements;
  }
}

module.exports = AgreementRepository;