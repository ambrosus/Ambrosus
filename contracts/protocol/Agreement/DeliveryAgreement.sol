pragma solidity ^0.4.11;

import "./Agreement.sol";
import "../../FoodCoin.sol";
import "../Measurements/MeasurementsOnChain.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Parties/Parties.sol";


contract DeliveryAgreement is Agreement {

    enum Stages {
        New,
        InProgress,
        Complete,
        Canceled,
        Reimbursed
    }

	function DeliveryAgreement(FoodCoin token, Measurements measurements, Requirements requirements, Validator validator, Parties parties) {
	}


	
}