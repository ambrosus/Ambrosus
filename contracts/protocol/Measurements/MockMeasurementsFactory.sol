pragma solidity ^0.4.11;

import "./MeasurementsOffChain.sol";
import "../Devices.sol";

contract MockMeasurementsFactory {

  MeasurementsOffChain public measurements;

  function MockMeasurementsFactory(address [] _devices, string ipfsHash) {
    measurements = new MeasurementsOffChain(new Devices(_devices), ipfsHash);        
  }

}