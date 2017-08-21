'use strict';
const promisify = require("es6-promisify");
const Offer = require('./Offer.js');
const RequirementsRepository = require('./RequirementsRepository');

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
        offer.packageWeight * 10**WEIGHT_DECIMALS, offer.pricePerUnit * 10**PRICE_DECIMALS, marketAddress,
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
      packageWeight: (web3.toDecimal(attributes[5]) / 10**WEIGHT_DECIMALS),
      pricePerUnit: (web3.toDecimal(attributes[6]) / 10**PRICE_DECIMALS),
      pricePerPackage: (web3.toDecimal(attributes[7]) / 10**PRICE_DECIMALS),
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
