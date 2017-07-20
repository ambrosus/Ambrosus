'use strict';
const Offer = require('./Offer.js');

class Market {

  getMarketAddress(){
    return this.marketContract.address;
  }

  async count(){
    return await this.marketContract.productCount();
  }

  async getOffers(_offerFactory){
    let count = await this.count();
    let offers = [];
    for (var i = 0; i < count; i++) {
      offers.push(await _offerFactory.createFromContract(await this.marketContract.productAt(i)));
    }
    return offers;
  }
}

module.exports = Market;