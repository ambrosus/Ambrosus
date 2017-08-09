pragma solidity ^0.4.11;

import "../Utils/MockToken.sol";
import "./Market.sol";

contract MarketFactory {

  Market public market;

  function MarketFactory(uint amount) {
    address[] memory addresses = new address[](1);
    addresses[0] = msg.sender;
    uint[] memory amounts = new uint[](1);
    amounts[0] = amount;
    market = new Market(new MockToken(addresses, amounts));        
  }

}