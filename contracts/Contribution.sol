pragma solidity ^0.4.8;

import "./FoodToken.sol";

contract Contribution {

  FoodToken public foodToken;

  uint public constant MAX_CONTRIBUTION_DURATION = 4 weeks;

  address public constant FOUNDER_ONE = 0x0000000000000000000000000000000000000001;

  uint public constant FOUNDER_STAKE = 1000;

  uint public startTime;
  uint public endTime;

  function Contribution(uint _startTime) {
    startTime = _startTime;
    endTime = startTime + MAX_CONTRIBUTION_DURATION;
    foodToken = new FoodToken(startTime, endTime);
    foodToken.preallocateToken(FOUNDER_ONE, FOUNDER_STAKE);
  }

}