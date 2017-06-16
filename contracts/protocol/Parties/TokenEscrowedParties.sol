pragma solidity ^0.4.11;

import "../../dependencies/ERC20Protocol.sol";
import "../Utils/ArrayUtils.sol";
import "./Parties.sol";

contract TokenEscrowedParties is Parties {

    using ArrayUtils for *;

    struct Party {
      address wallet;
      uint amount;
      bool has_accepted;
    }

    Party [] parties;

    address public owner;

    address public buyer;

    ERC20Protocol public token;

    function TokenEscrowedParties(ERC20Protocol _token) {
        owner = msg.sender;
        token = _token;
    }

    function inviteParticipants(address [] _parties, uint [] _amounts) {
        require(_parties.length == _amounts.length);    
        buyer = msg.sender;        
        for (uint i = 0; i < _parties.length; i++) {
            parties.push(Party(_parties[i], _amounts[i], false));
        }
        assert(token.transferFrom(buyer, this, ArrayUtils.sum(_amounts)));
    }

    function getParticipants() constant returns (address [], uint []) {
        address [] memory wallets = new address[](parties.length);
        uint [] memory amounts = new uint[](parties.length);
        for (uint i = 0; i < parties.length; i++) {
            wallets[i] = parties[i].wallet;
            amounts[i] = parties[i].amount;
        }
        return (wallets, amounts);
    }

    function approve() {
        for (uint i = 0; i < parties.length; i++) {
            assert(token.transfer(parties[i].wallet, parties[i].amount));
        }        
    }

    function reimburse() {
        token.transfer(buyer, token.balanceOf(this));
    }
}
