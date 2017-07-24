'use strict';
const Offer = require('./Offer.js');

const DEPLOY_GAS_LIMIT = 1000000;

class OfferRepository {

  constructor(_OfferContract) {
    this.OfferContract = _OfferContract;
  }

  async save(marketAddress, offer) {   
    if (!offer.seller || !web3.isAddress(offer.seller))
      throw Error('Seller should be specified');

    return await this.OfferContract.new(offer.name, offer.pricePerUnit,
      offer.packageWeight, offer.origin, offer.imageHash, marketAddress, 
      offer.measurementsAddress, offer.requirementsAddress, offer.validatorAddress, 
      {from: offer.seller, gas: DEPLOY_GAS_LIMIT});
  }

  async fromAddress(address) {
    var contract = await this.OfferContract.at(address);
    var attributes = await contract.getAttributes();
    return new Offer({
      name: attributes[0],
      origin: web3.toUtf8(attributes[1]),
      seller: attributes[2],
      imageHash: web3.toUtf8(attributes[3]),
      packageWeight: web3.toDecimal(attributes[4]),
      pricePerUnit: web3.toDecimal(attributes[5]),
      pricePerPackage: web3.toDecimal(attributes[6]),
      measurementsAddress: attributes[7],
      requirementsAddress: attributes[8],
      validatorAddress: attributes[9],
    });
  }

  async getAllFromMarket(_market) {
    let count = await _market.count();
    let offers = [];
    for (var i = 0; i < count; i++) {
      offers.push(await this.fromAddress(await _market.marketContract.productAt(i)));
    }
    return offers;
  }
}

module.exports = OfferRepository;
