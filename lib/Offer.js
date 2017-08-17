'use strict';

const MarketRepository = require('./MarketRepository');

class Offer {
  
  constructor(params) {   
    if (params) {
      Object.assign(this, params);
    }
  }

  async getSellerName(marketAddress) {
    var market = new MarketRepository().fromAddress(marketAddress);
    this.sellerName = await market.getUserName(this.seller);
    return this;
  }
}

module.exports = Offer;
