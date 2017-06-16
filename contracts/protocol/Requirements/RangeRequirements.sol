pragma solidity ^0.4.11;

import "../Requirements/Requirements.sol";

contract RangeRequirements is Requirements {

    enum AttributeType { Integer, Boolean }

    struct Attribute {
      bytes32 identifer;
      AttributeType attributeType;
      uint decimals;
      int min;
      int max;
    }

	Attribute [] attributes;

    function setAttributes(bytes32 [] _identifers, AttributeType [] _attributeTypes, uint [] _decimals, int [] _mins, int [] _maxs) onlyUnlocked {
        assert(_identifers.length == _mins.length);
        assert(_identifers.length == _decimals.length);
        assert(_identifers.length == _attributeTypes.length);
        assert(_identifers.length == _maxs.length);
        for (uint i = 0; i < _identifers.length; i++) {
            attributes.push(Attribute(_identifers[i], _attributeTypes[i], _decimals[i], _mins[i], _maxs[i]));
        }
        locked = true;
    }

    function getAttributes() constant returns (bytes32 [], AttributeType [], uint [], int [], int []) {
        bytes32 [] memory identifers = new bytes32[](attributes.length);
        AttributeType [] memory attributeTypes = new AttributeType[](attributes.length);
        uint [] memory decimals = new uint[](attributes.length);
        int [] memory mins = new int[](attributes.length);
        int [] memory maxs = new int[](attributes.length);
        for (uint i = 0; i < attributes.length; i++) {
            identifers[i] = attributes[i].identifer;
            attributeTypes[i] = attributes[i].attributeType;
            decimals[i] = attributes[i].decimals;
            mins[i] = attributes[i].min;
            maxs[i] = attributes[i].max;
        }
        return (identifers, attributeTypes, decimals, mins, maxs);
    }

    function getAttributesLength() constant returns (uint) {
        return attributes.length;
    }

    function getAttribute(uint i) constant returns (bytes32, AttributeType, uint, int, int) {
        return (attributes[i].identifer, attributes[i].attributeType, attributes[i].decimals, attributes[i].min, attributes[i].max);
    }

    function getAttributeById(bytes32 _id) constant returns (bytes32, AttributeType, uint, int, int) {
        bytes32 identifer;
        RangeRequirements.AttributeType t;
        uint decimal;
        int min;
        int max;
        for (uint i = 0; i < attributes.length; i++) {
            (identifer, t, decimal, min, max) = this.getAttribute(i);
            if (identifer == _id) {
                return (identifer, t, decimal, min, max);
            }
        }
    }


}
