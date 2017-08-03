pragma solidity ^0.4.11;

import "../Utils/Lockable.sol";

contract Requirements is Lockable {

  bytes32 public name;

  function Requirements(bytes32 _name) {
    name = _name;
  }
}
