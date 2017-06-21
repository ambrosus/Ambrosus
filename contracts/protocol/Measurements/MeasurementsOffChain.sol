import "./Measurements.sol";

contract MeasurementsOffChain is Measurements {

    struct Measurement {
      bytes32 attribute_id;
      int value;
      bytes32 event_id;
      uint timestamp;
      bytes32 farmer_id;
      bytes32 batch_id;
    }

    function addMeasurements(bytes32 [], int [], bytes32 [], uint [], bytes32 [], bytes32 []) {
    	assert(false);
    }
    
    function serializeMeasurement(bytes32 attribute_id, int value, bytes32 event_id, uint timestamp, bytes32 farmer_id, bytes32 batch_id) constant returns (uint[6] result) {
        Measurement memory measurement = Measurement(attribute_id, value, event_id, timestamp, farmer_id, batch_id);
        assembly {
            result := measurement
        }
        return result;
    }

    function deserializeMeasurement(uint[6] serialized) constant returns (bytes32, int, bytes32, uint, bytes32, bytes32) {
        Measurement memory m;
        assembly {
            m := serialized
        }
        return (m.attribute_id, m.value, m.event_id, m.timestamp, m.farmer_id, m.batch_id);
    }    

}
