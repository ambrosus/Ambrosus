pragma solidity ^0.4.11;

import "../Utils/Lockable.sol";
import "../Market/Market.sol";

contract Requirements is Lockable {

  bytes32 public name;

  function Requirements(bytes32 _name, Market _market) {
    name = _name;
    _market.pushRequirements(this);
  }
}
