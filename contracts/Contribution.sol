pragma solidity ^0.4.8;

import "./FoodToken.sol";

contract Contribution {

  FoodToken public foodToken;

  address public constant FOUNDER_ONE = 0x0000000000000000000000000000000000000001;

  uint public constant FOUNDER_STAKE = 1000;

  function Contribution() {
    foodToken = new FoodToken();
    foodToken.preallocateToken(FOUNDER_ONE, FOUNDER_STAKE);
  }

}