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
const MeasurementsRepository = require('./MeasurementsRepository.js');
const Agreement = require('./Agreement.js');
const AgreementRepository = require('./AgreementRepository.js');
const Profile = require('./Profile.js');
const ProfileRepository = require('./ProfileRepository.js');
const agreementArtifacts = require('../build/contracts/Agreement.json');
const mockTokenArtifacts = require('../build/contracts/MockToken.json');
const RequirementsRepository = require('./RequirementsRepository.js');
const Requirements = require('./Requirements.js');
const TokenSingleton = require('./TokenSingleton.js');
const requirementsArtifacts = require('../build/contracts/RangeRequirements.json');



module.exports = {

  Market: Market,
  MarketRepository: MarketRepository,
  MarketContract: contract(marketArtifacts),
  Offer: Offer,
  OfferRepository: OfferRepository,  
  OfferContract: contract(offerArtifacts),
  Measurement: Measurement,
  MeasurementsStorage: MeasurementsStorage,
  MeasurementsRepository: MeasurementsRepository,
  Agreement: Agreement,
  AgreementRepository: AgreementRepository,
  Profile: Profile,
  ProfileRepository: ProfileRepository,
  Requirements: Requirements,
  RequirementsRepository: RequirementsRepository,
  TokenSingleton: TokenSingleton,
  marketArtifacts: marketArtifacts,
  offerArtifacts: offerArtifacts,
  agreementArtifacts: agreementArtifacts,
  mockTokenArtifacts: mockTokenArtifacts,
  requirementsArtifacts: requirementsArtifacts,

  setProvider: function (provider) {
    this.MarketContract.setProvider(provider);  
    this.OfferContract.setProvider(provider);
  }

};


