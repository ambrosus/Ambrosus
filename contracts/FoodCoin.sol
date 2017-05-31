pragma solidity ^0.4.11;

import "./dependencies/SafeMath.sol";
import "./dependencies/ERC20.sol";

/// @title FoodCoin Token contract
/// @author Marek Kirejczyk <marek.kirejczyk@gmail.com>
contract FoodCoin is ERC20, SafeMath {

    // Constants
    string public constant name = "Food Token";
    string public constant symbol = "FOOD";
    uint public constant decimals = 18;
    uint public constant THAWING_DURATION = 2 years;
    uint public constant MAX_TOTAL_TOKEN_AMOUNT_OFFERED_TO_PUBLIC = 1000000 * 10 ** decimals; // Max amount of tokens offered to the public

    // Only changed in constructor
    uint public startTime; // Contribution start time in seconds
    uint public endTime; // Contribution end time in seconds
    address public minter;

    mapping (address => uint) preallocatedBalances;

    modifier only_minter {
        assert(msg.sender == minter);
        _;
    }

    modifier is_later_than(uint x) {
        assert(now > x);
        _;
    }

    modifier max_total_token_amount_not_reached(uint amount) {
        assert(safeAdd(totalSupply, amount) <= MAX_TOTAL_TOKEN_AMOUNT_OFFERED_TO_PUBLIC);
        _;
    }

    function FoodCoin(uint _startTime, uint _endTime) {
      startTime = _startTime;
      endTime = _endTime;
      minter = msg.sender;
      totalSupply = 0;
    }
    
    function preallocateToken(address recipient, uint amount)
        external
        only_minter
        max_total_token_amount_not_reached(amount)
    {
        preallocatedBalances[recipient] = safeAdd(preallocatedBalances[recipient], amount);
        totalSupply = safeAdd(totalSupply, amount);
    }
    
    function unlockBalance(address recipient) 
        is_later_than(endTime + THAWING_DURATION)
    {
        balances[recipient] = safeAdd(balances[recipient], preallocatedBalances[recipient]);
        preallocatedBalances[recipient] = 0;
    }

    function preallocatedBalanceOf(address _owner) constant returns (uint balance) {
        return preallocatedBalances[_owner];
    }

    function mintLiquidToken(address recipient, uint amount)
        external
        only_minter
        max_total_token_amount_not_reached(amount)
    {
        balances[recipient] = safeAdd(balances[recipient], amount);
        totalSupply = safeAdd(totalSupply, amount);
    }

    function transfer(address _to, uint256 _value) 
      is_later_than(endTime)
      returns (bool success) 
    {
      return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) 
      is_later_than(endTime)
      returns (bool success) 
    {
      return super.transferFrom(_from, _to, _value);
    }

    function setMinterAddress(address _minter) only_minter {
      minter = _minter;
    }
}
