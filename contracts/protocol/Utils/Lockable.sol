pragma solidity ^0.4.11;

contract Lockable {

	bool public locked;

	modifier onlyUnlocked() {
		require(!locked);
		_;
	}

}