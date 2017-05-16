pragma solidity ^0.4.8;

import "./dependencies/SafeMath.sol";
import "./dependencies/ERC20.sol";

contract FoodToken is ERC20, SafeMath {

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

    function FoodToken(uint _startTime, uint _endTime) {
      startTime = _startTime;
      endTime = _endTime;
      minter = msg.sender;
      totalSupply = 0;
    }

    function grant(address wallet, uint amount) {
      totalSupply += amount;
      balances[wallet] = amount;
    }

    function preallocateToken(address recipient, uint amount)
        external
        only_minter
    {
        preallocatedBalances[recipient] = safeAdd(preallocatedBalances[recipient], amount);
        totalSupply = safeAdd(totalSupply, amount);
    }
    
    function unlockBalance(address recipient) is_later_than(endTime + THAWING_DURATION)
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

}
