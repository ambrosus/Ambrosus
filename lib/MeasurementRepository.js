'use strict';
const promisify = require("es6-promisify");
const MeasurementsStorage = require('./MeasurementsStorage');
const Measurement = require('./Measurement');
const IPFSMap = require('./IPFSMap'); 
const utils = require('./web3-utils');

const DEPLOY_GAS_LIMIT = 1300000;

class MeasurementRepository {

  constructor(ipfs, measurementsJSON = require('../build/contracts/MeasurementsOffChain.json'),
    measurementsFactoryJSON = require('../build/contracts/MockMeasurementsFactory.json')) 
  {
    this.MeasurementFactoryContract = web3.eth.contract(measurementsFactoryJSON.abi);
    this.MeasurementContract = web3.eth.contract(measurementsJSON.abi);
    this.data = measurementsFactoryJSON.unlinked_binary;
    this.ipfs = ipfs;
  }

  async create(devices, transactionHashCallback) {
    var transactionParams = {
      from: _offer.seller,
      gas: DEPLOY_GAS_LIMIT,
      data: this.data
    }
    var ipfsMap = await IPFSMap.create(this.ipfs);
    return new Promise((resolve, reject) => {
      this.MeasurementFactoryContract.new(devices, ipfsMap.getOwnHash(), transactionParams, (err, newContract) => {
          if (err) {
            reject(err);
          } else if (!newContract.address && transactionHashCallback) {
            transactionHashCallback(newContract.transactionHash);
          } else if (newContract.address) {
            let measurementAddress = await promisify(newContract.measurements)();
            resolve(new MeasurementsStorage(ipfsMap, measurementAddress));
          }
        });
    });
  }

  async fromAddress(measurementsAddress) {
    var contract = this.MeasurementContract.at(measurementsAddress);
    var multihash = await promisify(contract.ipfsHash)();
    return new MeasurementsStorage(await IPFSMap.createFromHash(this.ipfs, multihash), measurementAddress);
  }
}

module.exports = MeasurementRepository;
