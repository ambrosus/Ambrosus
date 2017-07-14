'use strict';
const Offer = require('./Offer.js');

class OfferFactory {

	constructor(_OfferContract) {
		this.OfferContract = _OfferContract;
	}

	async saveOffer(marketAddress, offer) {		
		if (!offer.seller || !web3.isAddress(offer.seller))
			throw Error('Seller should be specified');

		return await this.OfferContract.new(offer.name, offer.pricePerUnit,
			offer.packageWeight, offer.origin, offer.imageHash, marketAddress, 
			offer.measurementsAddress, offer.requirementsAddress, offer.validatorAddress, 
			{from: offer.seller});
	}

	async createFromContract(address) {
		var contract = await this.OfferContract.at(address);
		var attributes = await contract.getAttributes();
		return new Offer({
			name: attributes[0],
			origin: global.web3.toUtf8(attributes[1]),
			seller: attributes[2],
			imageHash: global.web3.toUtf8(attributes[3]),
			packageWeight: global.web3.toDecimal(attributes[4]),
			pricePerUnit: global.web3.toDecimal(attributes[5]),
			pricePerPackage: global.web3.toDecimal(attributes[6]),
			measurementsAddress: attributes[7],
			requirementsAddress: attributes[8],
			validatorAddress: attributes[9],
		});
	}

}

module.exports = OfferFactory;