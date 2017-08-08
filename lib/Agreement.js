const promisify = require("es6-promisify");

const DEPLOY_GAS_LIMIT = 1500000;

class Agreement {

  constructor(offerAddress, quantity, tokenAddress, 
    agreementJSON = require('../build/contracts/EscrowedAgreement.json'), 
    tokenJSON = require('../build/contracts/MockToken.json')) {
    this.AgreementContract = web3.eth.contract(agreementJSON.abi);
    this.TokenContract = web3.eth.contract(tokenJSON.abi);
    this.data = agreementJSON.unlinked_binary;
    this.offerAddress = offerAddress;
    this.quantity = quantity;
    this.tokenAddress = tokenAddress;
  }

  initiateAgreement(transactionHashCallback) {
    const transactionParams = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    return new Promise((resolve, reject) => {
      this.AgreementContract.new(this.tokenAddress, this.offerAddress, this.quantity, transactionParams, 
        async (err, newAgreementContract) => {
          if (err) {
            reject(err);
          } else if (!newAgreementContract.address && transactionHashCallback) {
            transactionHashCallback(newAgreementContract.transactionHash);
          } else if (newAgreementContract.address) {
            var token = await this.TokenContract.at(this.tokenAddress);
            await promisify(token.approve)(newAgreementContract.address, await promisify(newAgreementContract.amount)(), 
              { from: web3.eth.accounts[0] }); 
            var status = await promisify(newAgreementContract.escrowWithSeller)({ from: web3.eth.accounts[0], gas: DEPLOY_GAS_LIMIT });
            if (!status)
              reject('Not enough funds');

            resolve(newAgreementContract);
          }
        });
    });
  }

  async accept(agreement) {
    await promisify(agreement.approve)({from: web3.eth.accounts[0]});
  }

  async reject(agreement) {
    await promisify(agreement.reimburse)({from: web3.eth.accounts[0]});
  }
}

module.exports = Agreement;
