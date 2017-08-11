pragma solidity ^0.4.11;

import "../Agreement/EscrowedAgreement.sol";

contract Profile {

  EscrowedAgreement[] agreements;

  function pushAgreement(EscrowedAgreement _agreemnent) {
    require(_agreemnent.stage()==EscrowedAgreement.Stages.InProgress);
    agreements.push(_agreemnent);
  }

  function agreementsCount() constant returns (uint) {
    return agreements.length;
  }

  function agreementAt(uint index) constant returns (EscrowedAgreement) {
    return agreements[index];
  } 

  
}