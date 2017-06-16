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

    enum State { New, Invited, Locked, Approved, Reimbursed}

    Party [] parties;

    State public state;

    address public owner;

    address public buyer;

    uint accepted_count;

    ERC20Protocol public token;

    modifier onlyState(State _state) {
        require(state == _state);
        _;
    }

    function TokenEscrowedParties(ERC20Protocol _token) {
        owner = msg.sender;
        token = _token;
    }

    function inviteParticipants(address [] _parties, uint [] _amounts) onlyState(State.New) {
        require(_parties.length == _amounts.length);    
        buyer = msg.sender;        
        for (uint i = 0; i < _parties.length; i++) {
            parties.push(Party(_parties[i], _amounts[i], false));
        }
        assert(token.transferFrom(buyer, this, ArrayUtils.sum(_amounts)));
        state = State.Invited;
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

    function getPartyByAddress(address _address) constant internal returns (Party) {
        for (uint i = 0; i < parties.length; i++) {
            if (parties[i].wallet == _address) {
                return parties[i];
            }
        }
        require(false);
    }


    function acceptInvite() onlyState(State.Invited) {
        Party memory party = getPartyByAddress(msg.sender);
        require(!party.has_accepted);
        party.has_accepted = true;
        accepted_count++;        
        if (accepted_count == parties.length) {
            state = State.Locked;
        }
    }

    function approve() onlyState(State.Locked) {
        for (uint i = 0; i < parties.length; i++) {
            assert(token.transfer(parties[i].wallet, parties[i].amount));
        } 
        state = State.Approved;
    }

    function reimburse() onlyState(State.Locked) {
        token.transfer(buyer, token.balanceOf(this));
        state = State.Reimbursed;      
    }
}
