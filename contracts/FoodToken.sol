pragma solidity 0.4.8;

import "./dependencies/SafeMath.sol";
import "./dependencies/ERC20.sol";

contract FoodToken is ERC20, SafeMath {

    string public constant name = "FOOD Token";
    string public constant symbol = "FDT";
    uint public constant decimals = 18;

    address public constant ACCOUNT_ONE = 0x0045579b737838a2bc10e155756ef69974380d48;
    address public constant ACCOUNT_TWO = 0x00a329c0648769a73afac7f9381e08fb43dbea72;
    uint public constant ACCOUNT_STAKE = 1000;

    function FoodToken() {
      totalSupply = 2000;
      balances[ACCOUNT_ONE] = ACCOUNT_STAKE;
      balances[ACCOUNT_TWO] = ACCOUNT_STAKE;
    }

}
