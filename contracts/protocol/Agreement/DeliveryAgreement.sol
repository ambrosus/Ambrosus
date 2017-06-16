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

    Parties public parties;

	function DeliveryAgreement(ERC20Protocol token, Measurements measurements, Requirements requirements, Validator validator) {
        parties = new TokenEscrowedParties(token);
    }

    function complete(bool success) {
        success ? parties.approve() : parties.reimburse();
    }
	
}