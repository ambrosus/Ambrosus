pragma solidity ^0.4.8;

/// @title ERC20 Token Protocol
/// @author Melonport AG <team@melonport.com>
/// @notice See https://github.com/ethereum/EIPs/issues/20
contract ERC20Protocol {

    function totalSupply() constant returns (uint256) {}
    function balanceOf(address) constant returns (uint256) {}
    function transfer(address _to, uint256 _value) returns (bool) {}
    function transferFrom(address _from, address _to, uint256 _value) returns (bool) {}
    function approve(address _spender, uint256 _value) returns (bool) {}
    function allowance(address _owner, address _spender) constant returns (uint256) {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}