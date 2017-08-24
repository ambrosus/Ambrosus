pragma solidity ^0.4.11;

import "../Utils/MockToken.sol";
import "./Market.sol";

contract MarketFactory {

  Market public market;

  function MarketFactory() {
    market = new Market(new MockToken(new address[](0), new uint[](0)), msg.sender);        
  }

}