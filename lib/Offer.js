'use strict';

class Offer {
  
  constructor(params) {   
    if (params) {
      this.name = params.name;
      this.origin = params.origin;
      this.seller = params.seller;
      this.packageWeight = params.packageWeight;
      this.pricePerUnit = params.pricePerUnit;
      this.pricePerPackage = params.pricePerPackage;
      this.imageHash = params.imageHash;
      this.measurementsAddress = params.measurementsAddress;
      this.requirementsAddress = params.requirementsAddress;
      this.validatorAddress = params.validatorAddress;
    }
  }
}

module.exports = Offer;
