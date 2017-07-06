pragma solidity ^0.4.11;

import "./Measurements.sol";
import "../Devices.sol";
import "../Utils/ECVerify.sol";


contract MeasurementsOffChain is Measurements, ECVerify {


    struct Measurement {
        bytes32 attribute_id;
        int value;
        bytes32 event_id;
        uint timestamp;
        bytes32 farmer_id;
        bytes32 batch_id;
        address device;
        bytes32 hash;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    uint constant SIZE = 11; //Measurement size

    Devices public devices;

    function MeasurementsOffChain(Devices _devices) {
        devices = _devices;
    }

    function addMeasurements(bytes32 [], int [], bytes32 [], uint [], bytes32 [], bytes32 []) {
        assert(false);
    }
    
    function validateAddressList(bytes32 [] data) constant returns (bool) {
        for (uint i = 0; i < (data.length/SIZE); i++) {
            if (!devices.containsDevice(address(data[i*SIZE+6]))) {
              return false;
            }
        }
        return true;
    }

    function verifyHashes(bytes32 [] data) constant returns (bool){
        for (uint i = 0; i < (data.length/SIZE); i++) {
            if (hashMeasurement(
                    bytes32(data[i*SIZE]),
                    int(    data[i*SIZE+1]),
                    bytes32(data[i*SIZE+2]),
                    uint(   data[i*SIZE+3]),
                    bytes32(data[i*SIZE+4]),
                    bytes32(data[i*SIZE+5]),
                    address(data[i*SIZE+6])
                ) != bytes32(data[i*SIZE+7]))
            {
                return false;
            }
            if (!isCorrect(bytes32(data[i*SIZE+7]), uint8(data[i*SIZE+8]), bytes32(data[i*SIZE+9]), bytes32(data[i*SIZE+10]), address(data[i*SIZE+6])))
                return false;
        }
        return true;
    }

    function getMeasurements(bytes32 [] data) constant returns (bytes32 [], int [], bytes32 [], uint [], bytes32 [], bytes32 []) {
        require(data.length % SIZE == 0);
        require(validateAddressList(data));
        require(verifyHashes(data));
        bytes32 [] memory attribute_ids = new bytes32[](data.length / SIZE);
        int [] memory values = new int[](data.length / SIZE);
        bytes32 [] memory event_ids = new bytes32[](data.length / SIZE);
        uint [] memory timestamps = new uint[](data.length / SIZE);
        bytes32 [] memory farmer_ids = new bytes32[](data.length / SIZE);
        bytes32 [] memory batch_ids = new bytes32[](data.length / SIZE);
        for (uint i = 0; i < (data.length/SIZE); i++) {
            attribute_ids[i] = bytes32(data[i*SIZE]);
            values[i] = int(data[i*SIZE+1]);
            event_ids[i] = bytes32(data[i*SIZE+2]);
            timestamps[i] = uint(data[i*SIZE+3]);
            farmer_ids[i] = bytes32(data[i*SIZE+4]);
            batch_ids[i] = bytes32(data[i*SIZE+5]);
        }
        return (attribute_ids, values, event_ids, timestamps, farmer_ids, batch_ids);
    }


    function hashMeasurement(
        bytes32 _attribute, 
        int  _value,
        bytes32  _event,
        uint  _timestamp,
        bytes32  _farmer_code, 
        bytes32  _batch_no, 
        address  _device
      ) constant returns (bytes32) {
        var hash = keccak256(_attribute, _value, _event, _timestamp, _farmer_code, _batch_no, _device);        
        return keccak256("\x19Ethereum Signed Message:\n32", hash);
    }


    function encodeMeasurements(
        bytes32 [] memory _attributes, 
        int [] memory _values, 
        bytes32 [] memory _events, 
        uint [] memory _timestamps, 
        bytes32 [] memory _farmer_codes, 
        bytes32 [] memory _batch_nos, 
        address [] memory _devices, 
        bytes32 [] memory _hashes,
        uint8 [] _v,
        bytes32 [] _r,
        bytes32 [] _s) constant returns (uint []) {

        require(_events.length == _attributes.length);
        require(_events.length == _values.length);
        require(_events.length == _timestamps.length);
        require(_events.length == _farmer_codes.length);
        require(_events.length == _batch_nos.length);

        uint [] memory data = new uint[](_attributes.length * SIZE);
        for (uint i = 0; i < _values.length; i++) {
            data[i*SIZE] = uint(_attributes[i]);
            data[i*SIZE+1] = uint(_values[i]);
            data[i*SIZE+2] = uint(_events[i]);
            data[i*SIZE+3] = uint(_timestamps[i]);
            data[i*SIZE+4] = uint(_farmer_codes[i]);
            data[i*SIZE+5] = uint(_batch_nos[i]);
            data[i*SIZE+6] = uint(_devices[i]);
            data[i*SIZE+7] = uint(_hashes[i]);
            data[i*SIZE+8] = uint(_v[i]);
            data[i*SIZE+9] = uint(_r[i]);
            data[i*SIZE+10] = uint(_s[i]);
        }
        return data;
    }

    function serializeMeasurement(bytes32 attribute_id, int value, bytes32 event_id, uint timestamp, bytes32 farmer_id, bytes32 batch_id, 
                                  address device, bytes32 hash, uint8 v, bytes32 r, bytes32 s) constant returns (uint[11] result) {
        Measurement memory measurement = Measurement(attribute_id, value, event_id, timestamp, farmer_id, batch_id, device, hash, v, r, s);
        assembly {
            result := measurement
        }
        return result;
    }

    function deserializeMeasurement(uint[11] serialized) constant returns (bytes32, int, bytes32, uint, bytes32, bytes32, address, bytes32, uint8, bytes32, bytes32) {
        Measurement memory m;
        assembly {
            m := serialized
        }
        return (m.attribute_id, m.value, m.event_id, m.timestamp, m.farmer_id, m.batch_id, m.device, m.hash, m.v, m.r, m.s);
    }    

}
