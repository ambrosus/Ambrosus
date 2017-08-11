'use strict';
const promisify = require("es6-promisify");

class Profile {

  constructor(contract) {
    this.profileContract = contract;
  }

  async agreements() {
    var count = await this.profileContract.agreementsCount({from: web3.eth.accounts[0]});
    var agreements = [];
    console.log(count)
    for (let i = 0; i < count; i++) {
      agreements.push(await promisify(this.profileContract.agreementAt)(i));
    }
    return agreements;
  }
}

module.exports = Profile;
