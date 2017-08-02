const DEPLOY_GAS_LIMIT = 1500000;


class Agreement {

  constructor(offer, quantity, agreementJSON, tokenJSON) {
    this.AgreementContract = web3.eth.contract(agreementJSON.abi);
    this.TokenContract = web3.eth.contract(tokenJSON.abi);
    this.data = agreementJSON.unlinked_binary;
    this.offer = offer;
    this.quantity = quantity;
  }

  initiateAgreement(tokenAddress, transactionHashCallback) {
    var tx = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    return new Promise((resolve, reject) => {
      this.AgreementContract.new(tokenAddress, this.offer.requirementsAddress, 
        this.offer.validatorAddress, this.offer.measurementsAddress, tx, 
        async (err, newAgreementContract) => {
          if (err) {
            reject(err);
          } else if (!newAgreementContract.address && transactionHashCallback) {
            transactionHashCallback(newAgreementContract.transactionHash);
          } else if (newAgreementContract.address) {
            var token = await this.TokenContract.at(tokenAddress);
            var amount = this.offer.pricePerPackage * this.quantity;

            await token.approve(newAgreementContract.address, amount, 
              { from: web3.eth.accounts[0] });            
            await newAgreementContract.escrowWithSeller(this.offer.seller, amount,
              { from: web3.eth.accounts[0], gas: DEPLOY_GAS_LIMIT });

            resolve(newAgreementContract);
          }
        });
    });
  }

  async accept(agreement) {
    await agreement.approve({from: web3.eth.accounts[0]});
  }

  async reject(agreement) {
    await agreement.reimburse({from: web3.eth.accounts[0]});
  }
}

module.exports = Agreement;
