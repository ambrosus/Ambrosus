'use strict';

const contract = require('truffle-contract');
const market_artifacts = require('../build/contracts/Market.json');
const offer_artifacts = require('../build/contracts/Offer.json');
const Measurement = require('./Measurement.js');
const Market = require('./Market.js');
const MarketRepository = require('./MarketRepository.js');
const Offer = require('./Offer.js');
const OfferRepository = require('./OfferRepository.js');
const MeasurementsStorage = require('./MeasurementsStorage.js');

module.exports = {

  Market: Market,
  MarketRepository: MarketRepository,
  MarketContract: contract(market_artifacts),
  Offer: Offer,
  OfferRepository: OfferRepository,  
  OfferContract: contract(offer_artifacts),
  Measurement: Measurement,
  MeasurementsStorage: MeasurementsStorage,

  setProvider: function (provider) {
    this.MarketContract.setProvider(provider);  
    this.OfferContract.setProvider(provider);
  }

};


