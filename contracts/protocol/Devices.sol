pragma solidity ^0.4.11;

contract Devices {
	
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