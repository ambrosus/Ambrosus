pragma solidity ^0.4.11;

contract Parties {

    struct Party {
      address wallet;
      uint amount;
      bool has_accepted;
    }

    Party [] parties;

    function inviteParticipants(address [] _parties, uint [] _amounts) {
        require(_parties.length == _amounts.length);
        for (uint i = 0; i < _parties.length; i++) {
            parties.push(Party(_parties[i], _amounts[i], false));
        }
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

}
