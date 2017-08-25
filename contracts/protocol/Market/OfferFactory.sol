pragma solidity ^0.4.11;

import "../Utils/MockToken.sol";
import "./Offer.sol";
import "./Market.sol";
import "../Measurements/MeasurementsOffChain.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Devices.sol";

contract OfferFactory {

  Offer public offer;

  function OfferFactory(
    string _name,
    bytes32 _origin,
    bytes32 _category,
    string _imageHash,
    uint _packageWeight,
    uint _price,
    Market _market,
    address []  _devices,
    string _ipfsHash,
    Requirements _requirements,
    Validator _validator) 
  {
    offer = new Offer(
      _name,
      _origin,
      _category,
      _imageHash,
      _packageWeight,
      _price,
      _market,
      msg.sender,
      new MeasurementsOffChain(new Devices(_devices), _ipfsHash),
      _requirements,
      _validator
    );        
  }

}