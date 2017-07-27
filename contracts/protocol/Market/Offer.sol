pragma solidity ^0.4.11;

import "./Market.sol";
import "../Measurements/Measurements.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Utils/Ownable.sol";

contract Offer is Ownable {

    string public name;

    bytes32 public origin;
    bytes32 public category;
    address public seller;
    string public imageHash;

    uint constant priceDecimals = 2;
    uint constant weightDecimals = 2;
    uint public packageWeight;
    uint public pricePerUnit;

    Measurements public measurements;
    Requirements public requirements;
    Validator public validator;

    function Offer(
        string _name,
        bytes32 _origin,
        bytes32 _category,
        string _imageHash,
        uint _packageWeight,
        uint _price,
        Market _market,
        Measurements _measurements,
        Requirements _requirements,
        Validator _validator)
    {       
        name = _name;
        pricePerUnit = _price;
        packageWeight = _packageWeight;
        origin = _origin;
        category = _category;
        imageHash = _imageHash;
        seller = msg.sender;
        measurements = _measurements;
        requirements = _requirements;
        validator = _validator;
        _market.push(this);
    }

    function pricePerPackage() constant returns (uint) {
        return pricePerUnit*packageWeight/100;
    }

    function getAttributes() constant returns (string, bytes32, bytes32, address,
                                               string, uint, uint, uint,
                                               Measurements, Requirements, Validator) 
    {
        return (name, origin, category, seller,
                imageHash, packageWeight, 
                pricePerUnit, pricePerPackage(),
                measurements, requirements, validator);
    }
}
