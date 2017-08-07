pragma solidity ^0.4.11;

import "./Offer.sol";
import "../Requirements/Requirements.sol";

contract Market{

	Offer[] products;
	Requirements[] requirements;

	function productCount() constant returns (uint) {
		return products.length;
	}

	function productAt(uint i) constant returns (Offer) {
		return products[i];
	}

	function pushOffer(Offer offer) {
		products.push(offer);
	}

	function requirementsCount() constant returns (uint) {
		return requirements.length;
	}

	function requirementsAt(uint i) constant returns (Requirements) {
		return requirements[i];
	}
	
	function pushRequirements(Requirements _requirements) {
		requirements.push(_requirements);
	}

	function getRequirementsByName(bytes32 name) constant returns (Requirements) {
		for (uint i=0; i<requirements.length; i++) {
			if (requirements[i].name() == name)
				return requirements[i];
		}
		assert(false);
	}
}