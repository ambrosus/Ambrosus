pragma solidity ^0.4.11;

import "./Offer.sol";
import "../Requirements/Requirements.sol";
import "../../dependencies/ERC20.sol";
import "../Profile/Profile.sol";

contract Market {

	Offer[] products;
	Requirements[] requirements;
	ERC20 public token;
	mapping (address => Profile) users;	

	function Market(ERC20 _token, address creator) {
		token = _token;
		users[creator] = new Profile();
	}

	function getMyProfile() constant returns (Profile) {
		return users[msg.sender];
	}

	function createProfile() {
		users[msg.sender] = new Profile();
	}

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