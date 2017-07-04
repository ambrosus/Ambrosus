pragma solidity ^0.4.11;

import "./Offer.sol";


contract Market{

	Offer[] products;

	function productCount() constant returns (uint){
		return products.length;
	}

	function productAt(uint i) constant returns (Offer){
		return products[i];
	}
	
	function push(Offer offer){
		products.push(offer);
	}
}