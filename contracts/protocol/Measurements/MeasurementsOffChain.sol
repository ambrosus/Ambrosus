import "./Measurements.sol";
import "../Devices.sol";

contract MeasurementsOffChain is Measurements {

    struct Measurement {
        bytes32 attribute_id;
        int value;
        bytes32 event_id;
        uint timestamp;
        bytes32 farmer_id;
        bytes32 batch_id;
        address device;
        bytes32 hash;
    }

    Devices devices;

    function MeasurementsOffChain(Devices _devices) {
        devices = _devices;
    }

    function addMeasurements(bytes32 [], int [], bytes32 [], uint [], bytes32 [], bytes32 []) {
        assert(false);
    }
    
    function getMeasurements(uint [] data) constant returns (bytes32 [], int [], bytes32 [], uint [], bytes32 [], bytes32 []) {
        require(data.length % 8 == 0);
        bytes32 [] memory attribute_ids = new bytes32[](data.length / 8);
        int [] memory values = new int[](data.length / 8);
        bytes32 [] memory event_ids = new bytes32[](data.length / 8);
        uint [] memory timestamps = new uint[](data.length / 8);
        bytes32 [] memory farmer_ids = new bytes32[](data.length / 8);
        bytes32 [] memory batch_ids = new bytes32[](data.length / 8);
       for (uint i = 0; i < (data.length/8); i++) {
            attribute_ids[i] = bytes32(data[i*8]);
            values[i] = int(data[i*8+1]);
            event_ids[i] = bytes32(data[i*8+2]);
            timestamps[i] = uint(data[i*8+3]);
            farmer_ids[i] = bytes32(data[i*8+4]);
            batch_ids[i] = bytes32(data[i*8+5]);
        }
        return (attribute_ids, values, event_ids, timestamps, farmer_ids, batch_ids);
    }

    function encodeMeasurements(
        bytes32 [] memory _attributes, 
        int [] memory _values, 
        bytes32 [] memory _events, 
        uint [] memory _timestamps, 
        bytes32 [] memory _farmer_codes, 
        bytes32 [] memory _batch_nos, 
        address [] memory _devices, 
        bytes32 [] memory _hashes) constant returns (uint []) {
        uint [] memory data = new uint[](_attributes.length * 8);
        for (uint i = 0; i < _values.length; i++) {
            data[i*8] = uint(_attributes[i]);
            data[i*8+1] = uint(_values[i]);
            data[i*8+2] = uint(_events[i]);
            data[i*8+3] = uint(_timestamps[i]);
            data[i*8+4] = uint(_farmer_codes[i]);
            data[i*8+5] = uint(_batch_nos[i]);
            data[i*8+6] = uint(_devices[i]);
            data[i*8+7] = uint(_hashes[i]);
        }
        return data;
    }

    function serializeMeasurement(bytes32 attribute_id, int value, bytes32 event_id, uint timestamp, bytes32 farmer_id, bytes32 batch_id, address device, bytes32 hash) constant returns (uint[8] result) {
        Measurement memory measurement = Measurement(attribute_id, value, event_id, timestamp, farmer_id, batch_id, device, hash);
        assembly {
            result := measurement
        }
        return result;
    }

    function deserializeMeasurement(uint[8] serialized) constant returns (bytes32, int, bytes32, uint, bytes32, bytes32, address, bytes32) {
        Measurement memory m;
        assembly {
            m := serialized
        }
        return (m.attribute_id, m.value, m.event_id, m.timestamp, m.farmer_id, m.batch_id, m.device, m.hash);
    }    

}
