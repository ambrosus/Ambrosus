pragma solidity ^0.4.11;

import "../../dependencies/ERC20.sol";

contract MockToken is ERC20 {

	function MockToken(address [] _addresses, uint256 [] _values) {
		for (uint i = 0; i < _addresses.length; i++) {
			balances[_addresses[i]] = _values[i];
			totalSupply += _values[i];
		}
	}

  function chargeMyAccount(uint amount) {
    balances[msg.sender] += amount;
    totalSupply += amount;
  }

}