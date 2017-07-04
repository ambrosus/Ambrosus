pragma solidity ^0.4.11;

import "./Market.sol";
import "../Measurements/Measurements.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Utils/Ownable.sol";

contract Offer is Ownable {

	string public name;

	bytes32 public origin;
	address public seller;

	uint constant priceDecimals = 2;
	uint constant weightDecimals = 2;
	uint public packageWeight;
	uint public pricePerUnit;

	Measurements public measurments;
	Requirements public requirements;
	Validator public validator;

	function Offer(
		uint _price,
		uint _packageWeight,
		bytes32 _origin,
		Market _market,
		Measurements _measurments,
		Requirements _requirements,
		Validator _validator)
	{		
		pricePerUnit = _price;
		packageWeight = _packageWeight;
		origin = _origin;
		seller = msg.sender;
		measurments = _measurments;
		requirements = _requirements;
		validator = _validator;
		_market.push(this);
	}

	function pricePerPackage() constant returns (uint){
		return pricePerUnit*packageWeight/100;
	}
}
