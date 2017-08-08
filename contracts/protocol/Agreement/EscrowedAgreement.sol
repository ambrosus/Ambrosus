pragma solidity ^0.4.11;

import "./Agreement.sol";
import "../../dependencies/ERC20Protocol.sol";
import "../Measurements/MeasurementsOnChain.sol";
import "../Requirements/Requirements.sol";
import "../Validator/Validator.sol";
import "../Market/Offer.sol";

contract EscrowedAgreement is Agreement {

    address public buyer;
    address public seller;
    uint public amount;
    ERC20Protocol token;

    modifier onlyBuyer() {
        require(msg.sender == buyer);
        _;
    }

    function EscrowedAgreement(ERC20Protocol _token, Offer _offer, uint _quantity) {
        buyer = msg.sender;
        token = _token;
        amount = _offer.pricePerPackage()*_quantity;
        seller = _offer.seller();
    }

    function escrowWithSeller() onlyBuyer returns (bool){
        return token.transferFrom(buyer, this, amount);
    }

    function approve() onlyBuyer {
        assert(token.transfer(seller, amount));
    }

    function reimburse() onlyBuyer {
        assert(token.transfer(buyer, amount));
    }
}
