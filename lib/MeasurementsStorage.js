const promisify = require("es6-promisify");
const IPFSMap = require('./IPFSMap.js');
const Measurement = require('./Measurement.js');
const utils = require('./web3-utils');


const DEPLOY_GAS_LIMIT = 1500000;

class MeasurementsStorage {

  constructor(ipfsMap, contractAddress,
    measurementsOffChainJSON = require('../build/contracts/MeasurementsOffChain.json')) {
    this.ipfsMap = ipfsMap;
    if (contractAddress) {
      let MeasurementsOffChain = web3.eth.contract(measurementsOffChainJSON.abi);
      this.contract = MeasurementsOffChain.at(contractAddress);
    }
  }

  async addMeasurement(measurement, transactionHashCallback) {
    await this.ipfsMap.add(JSON.stringify(measurement));
    if (!this.contract)
      return;
    var tx = await promisify(this.contract.setIpfsHash)(ipfsMap.getOwnHash(), 
    	{ from: web3.eth.accounts[0], gas: DEPLOY_GAS_LIMIT });
    if (transactionHashCallback) {
      transactionHashCallback(tx);
    }
    await utils.waitForTransaction(tx, DEPLOY_GAS_LIMIT);
    return tx;
  }

  async getMeasurements() {
    return await doGetMeasurments(async(e) => await validateMeasurement(e));
  }

  async validateMeasurement(encoded) {
    if (!await this.contract.validateAddressList(encoded))
      throw new Error('Some of the measurements were done by unauthorized devices.');
    if (!await this.contract.verifyHashes(encoded))
      throw new Error('Some of the measurements have invalid signatures.');
  }

  async doGetMeasurements(afterCallback) {
    if (!this.ipfsMap.catalog)
      return [];
    var measurements = (await this.ipfsMap.values())
      .map((m) => Object.assign(new Measurement(), JSON.parse(m)));
    if (!this.ipfsMap)
      return measurements;
    if (afterCallback)
      await afterCallback(encoded);
    return measurements;
  }

}

module.exports = MeasurementsStorage;
