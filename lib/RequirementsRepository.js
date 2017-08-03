var Requirements = require('./Requirements');

const DEPLOY_GAS_LIMIT = 1500000;

class RequirementsRepository {

  constructor(requirementsJSON = require('../build/contracts/RangeRequirements.json')) {
    this.RequirementsContract = web3.eth.contract(requirementsJSON.abi);
    this.data = requirementsJSON.unlinked_binary;
  }

  create(name, marketAddress, attributes, transactionHashCallback) {
    var ids = attributes.map((attribute) => attribute.id);
    var types = attributes.map((attribute) => 0);
    var decimals = attributes.map((attribute) => attribute.decimals);
    var mins = attributes.map((attribute) => attribute.min);
    var maxs = attributes.map((attribute) => attribute.max);

    var transactionParams = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }

    return new Promise((resolve, reject) => {
      this.RequirementsContract.new(name, marketAddress, transactionParams, 
        async(err, newContract) => {
          if (err) {
            reject(err);
          } else if (!newContract.address && transactionHashCallback) {
            transactionHashCallback(newContract.transactionHash);
          } else if (newContract.address) {
            await newContract.setAttributes(ids, types, decimals, mins, maxs,
             { from: web3.eth.accounts[0], gas: DEPLOY_GAS_LIMIT });

            resolve(new Requirements(newContract));
          }
        });
    });
  }

  async fromAddress(requirementsAddress) {
    return new Requirements(await this.RequirementsContract.at(requirementsAddress));
  }
}

module.exports = RequirementsRepository;