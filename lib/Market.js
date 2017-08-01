'use strict';
const promisify = require("es6-promisify");
const Offer = require('./Offer.js');

class Market {

  getAddress() {
    return this.marketContract.address;
  }

  async count() {
    return await promisify(this.marketContract.productCount)();
  }  
}

module.exports = Market;
