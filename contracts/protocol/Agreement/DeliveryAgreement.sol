pragma solidity ^0.4.11;

import "./Agreement.sol";
import "../../dependencies/ERC20Protocol.sol";
import "../Measurements/MeasurementsOnChain.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Parties/TokenEscrowedParties.sol";


contract DeliveryAgreement is Agreement {

    enum Stages {
        New,
        InProgress,
        Complete,
        Canceled,
        Reimbursed
    }

    TokenEscrowedParties public parties;

	function DeliveryAgreement(ERC20Protocol token, Requirements requirements, Validator validator, Measurements measurements) {
        require(requirements.locked());
        parties = new TokenEscrowedParties(token);
    }

    function complete(bool success) {
        require(parties.state() == TokenEscrowedParties.State.Locked);        
        success ? parties.approve() : parties.reimburse();
    }
	
}