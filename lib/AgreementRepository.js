const promisify = require("es6-promisify");
const Agreement = require('./Agreement');
const ProfileRepository = require('./ProfileRepository');

const DEPLOY_GAS_LIMIT = 1500000;

class AgreementRepository {

  constructor(tokenAddress, marketAddress,
    agreementJSON = require('../build/contracts/EscrowedAgreement.json'), 
    tokenJSON = require('../build/contracts/MockToken.json')) 
  {
    this.AgreementContract = web3.eth.contract(agreementJSON.abi);
    this.TokenContract = web3.eth.contract(tokenJSON.abi);
    this.data = agreementJSON.unlinked_binary;
    this.tokenAddress = tokenAddress;
    this.marketAddress = marketAddress;
  }

  initiateAgreement(offerAddress, quantity, transactionHashCallback) {
    const transactionParams = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    return new Promise((resolve, reject) => {
      this.AgreementContract.new(this.tokenAddress, offerAddress, quantity, transactionParams, 
        async (err, newAgreementContract) => {
          if (err) {
            reject(err);
          } else if (!newAgreementContract.address && transactionHashCallback) {
            transactionHashCallback(newAgreementContract.transactionHash);
          } else if (newAgreementContract.address) {
            var token = await this.TokenContract.at(this.tokenAddress);
            try {
              await promisify(token.approve)(newAgreementContract.address, await promisify(newAgreementContract.amount)(), 
                { from: web3.eth.accounts[0] });               
            } catch (e) { 
              reject(e);
            }
            resolve(new Agreement(newAgreementContract, this.marketAddress));
          }
        });
    });
  }

  async fromAddress(agreementAddress) {
    var contract = this.AgreementContract.at(agreementAddress);
    return new Agreement(contract, this.marketAddress);
  }

  async getAllUserAgreements(profileAddress) {
    var profileContract = new ProfileRepository().fromAddress(profileAddress).profileContract;
    var count = await profileContract.agreementsCount({from: web3.eth.accounts[0]});
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
