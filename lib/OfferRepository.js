'use strict';
const promisify = require("es6-promisify");
const Offer = require('./Offer.js');
const RequirementsRepository = require('./RequirementsRepository');
const Token = require('./TokenSingleton');
const utils = require('./web3-utils');

const DEPLOY_GAS_LIMIT = 4000000;
const PRICE_DECIMALS = Token.decimals;
const WEIGHT_DECIMALS = 2;

class OfferRepository {

  constructor(offerJSON = require('../build/contracts/Offer.json'),
    offerFactoryJSON = require('../build/contracts/OfferFactory.json')) {
    this.OfferContract = web3.eth.contract(offerJSON.abi);
    this.OfferFactory = web3.eth.contract(offerFactoryJSON.abi);
    this.offerData = offerJSON.unlinked_binary;
    this.factoryData = offerFactoryJSON.unlinked_binary;
  }

  static convertFromFormattedOffer(formattedOffer) {
    var offer = new Offer(formattedOffer);
    offer.name = formattedOffer.name ? formattedOffer.name : '';
    offer.imageHash = formattedOffer.imageHash ? formattedOffer.imageHash : '';    
    offer.pricePerPackage = utils.toBigNumberWithDecimals(formattedOffer.pricePerPackage, PRICE_DECIMALS);    
    offer.packageWeight = utils.toBigNumberWithDecimals(formattedOffer.packageWeight, WEIGHT_DECIMALS);
    return offer;
  }

  static convertToFormattedOffer(attributes) {
    return new Offer({
      name: attributes[0],
      origin: web3.toUtf8(attributes[1]),
      category: web3.toUtf8(attributes[2]),
      seller: attributes[3],
      imageHash: attributes[4],
      packageWeight: utils.fromBigNumberWithDecimals(attributes[5], WEIGHT_DECIMALS),
      pricePerPackage: utils.fromBigNumberWithDecimals(attributes[6], PRICE_DECIMALS),
      measurementsAddress: attributes[7],
      requirementsAddress: attributes[8],
      validatorAddress: attributes[9],
    });
  }

  async save(_marketAddress, _offer, _devices, _ipfsHash, transactionHashCallback) {
    if (!_offer.seller || !web3.isAddress(_offer.seller))
      throw Error('Seller should be specified');
    var transactionParams = {
      from: _offer.seller,
      gas: DEPLOY_GAS_LIMIT,
      data: this.factoryData
    }
    let offer = OfferRepository.convertFromFormattedOffer(_offer);
    return new Promise((resolve, reject) => {
      this.OfferFactory.new(
        offer.name, offer.origin, offer.category, offer.imageHash,
        offer.packageWeight, offer.pricePerPackage, _marketAddress,
        _devices, _ipfsHash, offer.requirementsAddress, offer.validatorAddress,
        transactionParams, async (err, newContract) => {
          if (err) {
            reject(err);
          } else if (!newContract.address && transactionHashCallback) {
            transactionHashCallback(newContract.transactionHash);
          } else if (newContract.address) {
            resolve(this.OfferContract.at(await promisify(newContract.offer)()));
          }
        });
    });
  }


  async fromAddress(address) {
    var contract = await this.OfferContract.at(address);
    var attributes = await promisify(contract.getAttributes)();
    var offer = OfferRepository.convertToFormattedOffer(attributes);
    offer.address = address;
    offer.pricePerUnit = offer.pricePerPackage / offer.packageWeight;
    var requirements = await new RequirementsRepository().fromAddress(offer.requirementsAddress);
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
