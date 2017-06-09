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
		bytes32 identifer;
		RangeRequirements.AttributeType t;
		uint decimal;
		int min;
		int max;
		(identifer, t, decimal, min, max) = requirements.getAttribute(i);

		bytes32 attribute_id;
		int value;
		bytes32 event_id;
		uint timestamp;
		bytes32 farmer_id;
		bytes32 batch_id;
		(attribute_id, value, event_id, timestamp, farmer_id, batch_id) = measurements.getMeasurement(i, new uint[](0));

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
