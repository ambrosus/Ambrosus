pragma solidity ^0.4.11;

import "./Offer.sol";
import "../Requirements/Requirements.sol";
import "../../dependencies/ERC20.sol";
import "../Profile/Profile.sol";

contract Market{

	Offer[] products;
	Requirements[] requirements;
	ERC20 public token;
	uint public v;
	mapping (address => Profile) users;	

	function Market(ERC20 _token, address creator) {
		token = _token;
		users[creator] = new Profile();
	}

	function buy(Offer _offer, uint _quantity) {
		EscrowedAgreement agreement = new EscrowedAgreement(token, _offer, _quantity, msg.sender);
		assert(token.transferFrom(msg.sender, agreement, agreement.amount()));
		if (users[msg.sender] == address(0x0)) {
			users[msg.sender] = new Profile();
		}
		users[msg.sender].pushAgreement(agreement); 
	}

	function getNewestAgreement() constant returns (EscrowedAgreement) {
		assert(users[msg.sender] != address(0x0));
		assert(users[msg.sender].agreementsCount() > 0);
		return users[msg.sender].agreementAt(users[msg.sender].agreementsCount()-1);
	}

	function getMyProfile() constant returns (Profile) {
		return users[msg.sender];
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