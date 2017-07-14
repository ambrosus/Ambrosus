'use strict';

const contract = require('truffle-contract');
const Offer = require('./Offer.js');

const market_artifacts = require('../build/contracts/Market.json');
// const offer_artifacts = require('../build/contracts/Offer.json');
const OfferFactory= require('./OfferFactory.js');
var MarketContract = contract(market_artifacts);
// var OfferContract = contract(offer_artifacts);

class Market {

	constructor(){
		MarketContract.setProvider(global.web3.currentProvider);
		// OfferContract.setProvider(global.web3.currentProvider);
	}

	static async create(creator){
		var market = new Market();
		market.marketContract = await MarketContract.new({from: creator, gas: 200000});
		return market;
	}

	static async createFromAddress(marketAddress){
		var market = new Market();
		market.marketContract = await MarketContract.at(marketAddress);
		return market;
	}

	getMarketAddress(){
		return this.marketContract.address;
	}

	async count(){
		return await this.marketContract.productCount();
	}

	async getOffers(_offerFactory){
		let count = await this.count();
		let offers = [];
		for (var i = 0; i < count; i++) {
			offers.push(await _offerFactory.createFromContract(await this.marketContract.productAt(i)));
		}
		return offers;
	}

}

module.exports = Market;