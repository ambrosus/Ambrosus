'use strict';
const Offer = require('./Offer.js');

const DEPLOY_GAS_LIMIT = 1300000;

class OfferRepository {

  constructor(_OfferContract) {
    this.OfferContract = _OfferContract;
  }

  async save(marketAddress, offer) {
    if (!offer.seller || !web3.isAddress(offer.seller))
      throw Error('Seller should be specified');
    const name = offer.name ? offer.name : '';
    const imageHash = offer.imageHash ? offer.imageHash : '';
    return await this.OfferContract.new(name, offer.origin, offer.category, imageHash,
      offer.packageWeight, offer.pricePerUnit, marketAddress, 
      offer.measurementsAddress, offer.requirementsAddress, offer.validatorAddress, 
      { from: offer.seller, gas: DEPLOY_GAS_LIMIT });
  }

  async fromAddress(address) {
    var contract = await this.OfferContract.at(address);
    var attributes = await contract.getAttributes();
    return new Offer({
      name: attributes[0],
      origin: web3.toUtf8(attributes[1]),
      category: web3.toUtf8(attributes[2]),
      seller: attributes[3],
      imageHash: attributes[4],
      packageWeight: web3.toDecimal(attributes[5]),
      pricePerUnit: web3.toDecimal(attributes[6]),
      pricePerPackage: web3.toDecimal(attributes[7]),
      measurementsAddress: attributes[8],
      requirementsAddress: attributes[9],
      validatorAddress: attributes[10],
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