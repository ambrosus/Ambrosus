'use strict';
const promisify = require("es6-promisify");
const Offer = require('./Offer.js');

class Market {

  getAddress() {
    return this.marketContract.address;
  }

  async offersCount() {
    return await promisify(this.marketContract.productCount)();
  }  

  async requirementsCount() {
    return await promisify(this.marketContract.requirementsCount)();
  }  

  async getTokenAddress() {
    return await promisify(this.marketContract.token)();
  }
}

module.exports = Market;
