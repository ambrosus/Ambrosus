pragma solidity ^0.4.11;

import "./Qualit.sol";

/// @title Contribution Contract for Qualit
/// @author Marek Kirejczyk <marek.kirejczyk@gmail.com>
/// @notice Inspired by https://github.com/melonproject/melon
contract Contribution is SafeMath {

  Qualit public qualit;
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

  event TokensBought(address indexed sender, uint eth, uint amount);


  function Contribution(uint _startTime, address _sss) {
    sss = _sss;
    startTime = _startTime;
    endTime = startTime + MAX_CONTRIBUTION_DURATION;
    qualit = new Qualit(startTime, endTime);
    qualit.preallocateToken(FOUNDER_ONE, FOUNDER_STAKE);
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
    qualit.mintLiquidToken(msg.sender, amount);
    assert(sss.send(msg.value));
    TokensBought(msg.sender, msg.value, amount);
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