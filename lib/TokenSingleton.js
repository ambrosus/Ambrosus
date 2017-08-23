const promisify = require("es6-promisify");
const utils = require('./web3-utils');

const DEPLOY_GAS_LIMIT = 1500000;
const DECIMALS = 2;

let instance = null;

class TokenSingleton {

  static get decimals() {
    return DECIMALS;
  }

  constructor(tokenJSON = require('../build/contracts/MockToken.json')) {
    if (instance) {
      return instance;
    }
    instance = this;
    this.TokenContract = web3.eth.contract(tokenJSON.abi);
    this.data = tokenJSON.unlinked_binary;
  }

  create(addresses = [web3.eth.accounts[0]], amounts = [0], transactionHashCallback) {
    const transactionParams = {
      from: web3.eth.accounts[0],
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    
    return new Promise((resolve, reject) => {
      this.TokenContract.new(addresses, amounts.map(val => utils.toBigNumberWithDecimals(val, 2)), transactionParams,
        async (err, newTokenContract) => {
          if (err) {
            reject(err);
          } else if (!newTokenContract.address && transactionHashCallback) {
            transactionHashCallback(newTokenContract.transactionHash);
          } else if (newTokenContract.address) {
            this.contract = newTokenContract;
            resolve(this);
          }
        });
    });
  }

  fromAddress(address) {
    this.contract = this.TokenContract.at(address);
    return this;
  }

  async balanceOf(address = web3.eth.accounts[0]) {
    return utils.fromBigNumberWithDecimals(await promisify(this.contract.balanceOf)(address), 2);
  }
}

module.exports = TokenSingleton;
