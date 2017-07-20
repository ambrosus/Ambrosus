'use strict';
const Offer = require('./Offer.js');

class Market {

  getAddress() {
    return this.marketContract.address;
  }

  async count() {
    return await this.marketContract.productCount();
  }  
}

module.exports = Market;
