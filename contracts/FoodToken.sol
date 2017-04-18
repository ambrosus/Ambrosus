pragma solidity 0.4.8;

import "./dependencies/SafeMath.sol";
import "./dependencies/ERC20.sol";

contract FoodToken is ERC20, SafeMath {

    string public constant name = "FOOD Token";
    string public constant symbol = "FDT";
    uint public constant decimals = 18;

    function FoodToken() {
      totalSupply = 0;
    }
    
    function grant(address wallet, uint amount) {
      totalSupply += amount;
      balances[wallet] = amount;
    }

}
