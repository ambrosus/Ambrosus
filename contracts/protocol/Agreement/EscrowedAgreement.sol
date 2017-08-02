pragma solidity ^0.4.11;

import "./Agreement.sol";
import "../../dependencies/ERC20Protocol.sol";
import "../Measurements/MeasurementsOnChain.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Parties/TokenEscrowedParties.sol";


contract EscrowedAgreement is Agreement {

    address buyer;
    address seller;
    uint amount;
    ERC20Protocol token;

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    function EscrowedAgreement(ERC20Protocol _token, Requirements, Validator, Measurements) {
        buyer = msg.sender;
        token = _token;
    }

    function escrowWithSeller(address _seller, uint _amount) onlyBuyer {
        seller = _seller;
        amount = _amount;
        assert(token.transferFrom(buyer, this, _amount));
    }

    function approve() onlyBuyer {
        assert(token.transfer(seller, amount));
    }

    function reimburse() onlyBuyer {
        assert(token.transfer(buyer, amount));
    }
}