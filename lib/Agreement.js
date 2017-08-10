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
            try {
              await promisify(token.approve)(newAgreementContract.address, await promisify(newAgreementContract.amount)(), 
                { from: web3.eth.accounts[0] });               
            } catch (e) { 
              reject(e);
            }
            resolve(newAgreementContract);
          }
        });
    });
  }

  async transfer(contract) {
    return await promisify(contract.escrowWithSeller)({ from: web3.eth.accounts[0], gas: DEPLOY_GAS_LIMIT });    
  }

  async accept(contract) {
    await promisify(contract.approve)({from: web3.eth.accounts[0]});
  }

  async reject(contract) {
    await promisify(contract.reimburse)({from: web3.eth.accounts[0]});
  }
}

module.exports = Agreement;
