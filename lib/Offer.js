'use strict';

class Offer {
  
  constructor(params) {   
    if (params) {
      Object.assign(this, params);
    }
  }
  
  get pricePerUnit() {
    return this.pricePerPackage * this.packageWeight;
  }
}

module.exports = Offer;
