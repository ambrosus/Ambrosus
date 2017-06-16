contract Parties {

    function inviteParticipants(address [] _parties, uint [] _amounts);
    
    function getParticipants() constant returns (address [], uint []);

}