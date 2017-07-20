const IPFSMap = require('./IPFSMap.js');
const Measurement = require('./Measurement.js');
let MeasurementsOffChain;

class MeasurementsStorage {

	constructor(ipfsMap, contractAddress) {
		this.ipfsMap = ipfsMap;
		if (contractAddress){
			MeasurementsOffChain = artifacts.require("./protocol/Measurements/MeasurementsOffChain.sol");
			this.contract = MeasurementsOffChain.at(contractAddress);
		}
	}

	async addMeasurement(measurement) {
		await this.ipfsMap.add(JSON.stringify(measurement));
	}

	async getMeasurements() {
		return await doGetMeasurments(async (e) => await validateMeasurement(e));
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
			.map((m)=>Object.assign(new Measurement(), JSON.parse(m)));
		if (!this.ipfsMap)
			return measurements;
		if (afterCallback)
			await afterCallback(encoded);
		return measurements;
	}		

}

module.exports = MeasurementsStorage;