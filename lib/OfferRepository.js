'use strict';
const promisify = require("es6-promisify");
const Offer = require('./Offer.js');
const RequirementsRepository = require('./RequirementsRepository');
const utils = require('./web3-utils');

const DEPLOY_GAS_LIMIT = 1300000;
const PRICE_DECIMALS = 2;
const WEIGHT_DECIMALS = 2;

class OfferRepository {

  constructor(offerJSON = require('../build/contracts/Offer.json')) {
    this.OfferContract = web3.eth.contract(offerJSON.abi);
    this.data = offerJSON.unlinked_binary;
  }

  async save(marketAddress, offer, transactionHashCallback) {
    if (!offer.seller || !web3.isAddress(offer.seller))
      throw Error('Seller should be specified');
    const name = offer.name ? offer.name : '';
    const imageHash = offer.imageHash ? offer.imageHash : '';
    var transactionParams = {
      from: offer.seller,
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    return new Promise((resolve, reject) => {
      this.OfferContract.new(
        name, offer.origin, offer.category, imageHash,
        utils.toBigNumberWithDecimals(offer.packageWeight, WEIGHT_DECIMALS), 
        utils.toBigNumberWithDecimals(offer.pricePerUnit, PRICE_DECIMALS), marketAddress,
        offer.measurementsAddress, offer.requirementsAddress, offer.validatorAddress,
        transactionParams, (err, newContract) => {
          if (err) {
            reject(err);
          } else if (!newContract.address && transactionHashCallback) {
            transactionHashCallback(newContract.transactionHash);
          } else if (newContract.address) {
            resolve(newContract);
          }
        });
    });
  }

  async fromAddress(address) {
    var contract = await this.OfferContract.at(address);
    var attributes = await promisify(contract.getAttributes)();
    var offer = new Offer({
      name: attributes[0],
      origin: web3.toUtf8(attributes[1]),
      category: web3.toUtf8(attributes[2]),
      seller: attributes[3],
      imageHash: attributes[4],
      packageWeight: utils.fromBigNumberWithDecimals(attributes[5], WEIGHT_DECIMALS),
      pricePerUnit: utils.fromBigNumberWithDecimals(attributes[6], PRICE_DECIMALS),
      pricePerPackage: utils.fromBigNumberWithDecimals(attributes[7], PRICE_DECIMALS),
      measurementsAddress: attributes[8],
      requirementsAddress: attributes[9],
      validatorAddress: attributes[10],
      address: address,
    });
    var requirements = await new RequirementsRepository().fromAddress(attributes[9]);
    offer.quality = await requirements.getName();
    return offer;
  }

  async getAllFromMarket(_market) {
    let count = await _market.offersCount();
    let offers = [];
    for (var i = 0; i < count; i++) {
      var productAddress = await promisify(_market.marketContract.productAt)(i);
      offers.push(await this.fromAddress(productAddress));
    }
    return offers;
  }
}

module.exports = OfferRepository;
