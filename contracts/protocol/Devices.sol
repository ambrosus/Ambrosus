pragma solidity ^0.4.11;

import "./Utils/Lockable.sol";
import "./Utils/Ownable.sol";


contract Devices is Lockable, Ownable {
	
	address [] public devices;

	function Devices(address [] _devices) {
		devices = _devices;		
	}

	function containsDevice(address _device) constant returns (bool) {
		for (uint i = 0; i < devices.length; i++) {
			if (devices[i] == _device) {
				return true;
			}
		}
		return false;
	}
}