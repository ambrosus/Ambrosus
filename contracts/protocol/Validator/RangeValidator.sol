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

	function isMeasurementValid(uint i) constant returns (bool) {	
		int value;
		bytes32 identifer;
		(identifer, value) = measurements.getMeasurementIdAndValue(i, new uint [](0));
        RangeRequirements.AttributeType t;
        uint decimal;
        int min;
        int max;
		(identifer, t, decimal, min, max) = requirements.getAttributeById("Volume");
		return min <= value && value <= max;
	}

	function countInvalidFields() constant returns (uint count) {
		for (uint i = 0; i < requirements.getAttributesLength(); i++) {
        	if (isMeasurementValid(i))
        	    count++;
        }
	}

	function validate() constant returns (bytes32 []) {
        uint j = 0;
		int value;
		bytes32 identifer;
		uint size = countInvalidFields();
        bytes32 [] memory result = new bytes32[](size);
		
		
		
		for (uint i = 0; i < requirements.getAttributesLength(); i++) {
        	if (isMeasurementValid(i)) {
        	    (identifer, value) = measurements.getMeasurementIdAndValue(i, new uint [](0));
        	    result[j++] = identifer;
        	}
        }

        return result;
	}

	function isValid() constant returns (bool) {
		return true;
	}
}
