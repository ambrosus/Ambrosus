'use strict';
const promisify = require("es6-promisify");


class Profile {

  constructor(contract) {
    this.profileContract = contract;
  }

  getAddress() {
    return this.profileContract.address;
  }

  async getUserName() {
    return web3.toUtf8(await promisify(this.profileContract.name)());
  }

}

module.exports = Profile;
