pragma solidity ^0.4.11;

import "./Validator.sol";
import "../Measurements/Measurements.sol";
import "../Requirements/RangeRequirements.sol";

contract RangeValidator is Validator {

	RangeRequirements requirements;
	Measurements measurements;

	function RangeValidator(Measurements _measurements, RangeRequirements _requirements) {
		requirements = _requirements;
		measurements = _measurements;
	}


	function isAttributeValid(uint i) constant returns (bool) {	
		int value = measurements.getMeasurementValue(i, new uint [](0));
        bytes32 identifer;
        RangeRequirements.AttributeType t;
        uint decimal;
        int min;
        int max;
		(identifer, t, decimal, min, max) = requirements.getAttributeById("Volume");
		return min <= value && value <= max;
	}

	function validate() constant returns (bytes32 []) {
		uint i = 0;
		for (i = 0; i < requirements.getAttributeLength(); i++) {
        	if (isAttributeValid(i))
        	    i++;
        }
        bytes32 [] memory result = new bytes32[](i);
        return result;
	}

	function isValid() constant returns (bool) {
		return true;
	}
}
