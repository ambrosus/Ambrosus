pragma solidity ^0.4.11;

/// @title ERC20 Token Protocol
/// @author Marek Kirejczyk <marek.kirejczyk@gmail.com>
/// @notice See https://github.com/ethereum/EIPs/issues/20
/// Inspired by https://github.com/melonproject/melon
contract ERC20Protocol {

    function totalSupply() constant returns (uint256) {}
    function balanceOf(address) constant returns (uint256);
    function transfer(address, uint256) returns (bool);
    function transferFrom(address, address, uint256) returns (bool);
    function approve(address, uint256) returns (bool);
    function allowance(address, address) constant returns (uint256);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}