pragma solidity ^0.4.8;

import "./FoodToken.sol";

contract Contribution is SafeMath {

  FoodToken public foodToken;
  address public sss;

  uint public constant MAX_CONTRIBUTION_DURATION = 4 weeks;

  address public constant FOUNDER_ONE = 0x0000000000000000000000000000000000000001;

  uint public constant FOUNDER_STAKE = 1000;
  
  uint public constant PRICE_RATE_FIRST = 2200; //1 ETH = 2.2 FOOD TOKEN
  uint public constant DIVISOR_PRICE = 1000;

  uint public startTime;
  uint public endTime;
  
  bool public halted;
  
  modifier is_not_halted {
      assert(!halted);
      _;
  }

  modifier is_not_earlier_than(uint x) {
      assert(now >= x);
      _;
  }

  modifier is_earlier_than(uint x) {
      assert(now < x);
      _;
  }
  
  modifier only_sss() {
      assert(msg.sender == sss);
      _;
  }

  function Contribution(uint _startTime, address _sss) {
    sss = _sss;
    startTime = _startTime;
    endTime = startTime + MAX_CONTRIBUTION_DURATION;
    foodToken = new FoodToken(startTime, endTime);
    foodToken.preallocateToken(FOUNDER_ONE, FOUNDER_STAKE);
    // TODO Preallocate all tokens
  }

  function priceRate() constant returns (uint) {
    return PRICE_RATE_FIRST;
  }

  function buy () payable external 
    is_not_earlier_than(startTime) 
    is_earlier_than(endTime) 
    is_not_halted
  {
    uint amount = safeMul(msg.value, PRICE_RATE_FIRST) / DIVISOR_PRICE;
    foodToken.mintLiquidToken(msg.sender, amount);
    assert(sss.send(msg.value));
  }
  
  function setSSSAddress(address _sss) only_sss { 
    sss = _sss; 
  }
  
  function halt() only_sss { 
    halted = true; 
  }

  function unhalt() only_sss { 
    halted = false; 
  }

}