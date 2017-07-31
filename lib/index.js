'use strict';

const contract = require('truffle-contract');
const marketArtifacts = require('../build/contracts/Market.json');
const offerArtifacts = require('../build/contracts/Offer.json');
const Measurement = require('./Measurement.js');
const Market = require('./Market.js');
const MarketRepository = require('./MarketRepository.js');
const Offer = require('./Offer.js');
const OfferRepository = require('./OfferRepository.js');
const MeasurementsStorage = require('./MeasurementsStorage.js');

module.exports = {

  Market: Market,
  MarketRepository: MarketRepository,
  MarketContract: contract(marketArtifacts),
  Offer: Offer,
  OfferRepository: OfferRepository,  
  OfferContract: contract(offerArtifacts),
  Measurement: Measurement,
  MeasurementsStorage: MeasurementsStorage,
  marketArtifacts: marketArtifacts,
  offerArtifacts: offerArtifacts,

  setProvider: function (provider) {
    this.MarketContract.setProvider(provider);  
    this.OfferContract.setProvider(provider);
  }

};


