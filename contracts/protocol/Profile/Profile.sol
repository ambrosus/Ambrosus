pragma solidity ^0.4.11;

import "../Agreement/EscrowedAgreement.sol";
import "../Utils/Ownable.sol";

contract Profile is Ownable{

  EscrowedAgreement[] agreements;

  function pushAgreement(EscrowedAgreement _agreement) onlyOwner{
    require(_agreement.stage() == EscrowedAgreement.Stages.InProgress);
    agreements.push(_agreement);
  }

  function agreementsCount() constant returns (uint) {
    return agreements.length;
  }

  function agreementAt(uint index) constant returns (EscrowedAgreement) {
    return agreements[index];
  } 

  
}