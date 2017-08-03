pragma solidity ^0.4.11;

import "./RangeRequirements.sol";
import "../Market/Market.sol";

contract RangeRequirementsFactory is RangeRequirements{

    function RangeRequirementsFactory(bytes32 _name, Market _market) RangeRequirements(_name) {
        _market.pushRequirements(this);
    }
}
