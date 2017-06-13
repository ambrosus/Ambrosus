pragma solidity ^0.4.11;

import "./Measurements.sol";

contract MeasurementsOnChain is Measurements {

    struct Measurement {
      bytes32 attribute_id;
      int value;
      bytes32 event_id;
      uint timestamp;
      uint block_timestamp;
      bytes32 farmer_id;
      bytes32 batch_id;
    }

    Measurement [] measurements;

    function addMeasurements(bytes32 [] _attributes, int [] _values, bytes32 [] _events, uint [] _timestamps, bytes32 [] _farmer_codes, bytes32 [] _batch_nos) {
        require(_events.length == _attributes.length);
        require(_events.length == _values.length);
        require(_events.length == _timestamps.length);
        require(_events.length == _farmer_codes.length);
        require(_events.length == _batch_nos.length);
        for (uint i = 0; i < _events.length; i++) {
            measurements.push(Measurement(_attributes[i], _values[i], _events[i], _timestamps[i], block.timestamp, _farmer_codes[i], _batch_nos[i]));
        }
    }

    function getMeasurements(uint []) constant returns (bytes32 [], int [], bytes32 [], uint [], bytes32 [], bytes32 []) {    
        bytes32 [] memory attribute_ids = new bytes32[](measurements.length);
        int [] memory values = new int[](measurements.length);
        bytes32 [] memory event_ids = new bytes32[](measurements.length);
        uint [] memory timestamps = new uint[](measurements.length);
        bytes32 [] memory farmer_ids = new bytes32[](measurements.length);
        bytes32 [] memory batch_ids = new bytes32[](measurements.length);
        for (uint i = 0; i < measurements.length; i++) {
            attribute_ids[i] = measurements[i].attribute_id;
            values[i] = measurements[i].value;
            event_ids[i] = measurements[i].event_id;
            timestamps[i] = measurements[i].timestamp;
            farmer_ids[i] = measurements[i].farmer_id;
            batch_ids[i] = measurements[i].batch_id;
        }
        return (attribute_ids, values, event_ids, timestamps, farmer_ids, batch_ids);
    }

    function getMeasurementIdAndValue(uint i, uint []) constant returns (bytes32, int) {    
            return (measurements[i].attribute_id, measurements[i].value);
    }


}