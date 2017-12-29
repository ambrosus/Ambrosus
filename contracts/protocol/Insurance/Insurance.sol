pragma solidity ^0.4.11;

import "../Utils/Ownable.sol";
import "../Agreement/EscrowedAgreement.sol";

contract Insurance is Ownable {

    enum Status {
        Unknown,
        Active,
        ReimbursementRequested,
        ReimbursementApproved,
        ReimbursementRejected,
        Complete
    }

    struct InsuranceDetails {
        Status status;
        address beneficiary;
    }

    ERC20Protocol private token;

    mapping (address => InsuranceDetails) public insuredAgreements;

    event NewAgreementInsured(address beneficiary, address agreement);
    event ReimbursementRequested(address requestor, address agreement);
    event ReimbursementApproved(address agreement);
    event ReimbursementRejected(address agreement);
    event ReimbursementPaid(address payee, address agreement, uint amount);

    function Insurance (ERC20Protocol _token) {
        token = _token;
    }

    function () public {
        // Nothing. Do not accept ETH transfers.
    }

    function insure(EscrowedAgreement agreement, uint premium) public {
        require (agreement != address(0x0));
        require (insuredAgreements[agreement].status == Status.Unknown);
        require (agreement.seller() == msg.sender || agreement.buyer() == msg.sender);
        require (premium > 0);

        require (token.transferFrom(msg.sender, this, premium));

        /* 
            The specific insurance contracts inheriting from this contract must override 
            this function to do additional validations of agreement, premium and other details
            before underwriting.
        */

        insuredAgreements[agreement] = InsuranceDetails(Status.Active, msg.sender);
        
        NewAgreementInsured(msg.sender, agreement);
    }

    function requestReimbursement(Agreement agreement) public {
        require (agreement != address(0x0));

        InsuranceDetails storage insurance = insuredAgreements[agreement];

        require (insurance.status == Status.Active);
        require (insurance.beneficiary == msg.sender);

        insurance.status = Status.ReimbursementRequested;
        ReimbursementRequested(msg.sender, agreement);
    }

    function reimburse(EscrowedAgreement agreement) public {
        require (agreement != address(0x0));

        InsuranceDetails storage insurance = insuredAgreements[agreement];

        require (insurance.status == Status.ReimbursementApproved);
        require (insurance.beneficiary == msg.sender);

        insurance.status = Status.Complete;

        uint amount = agreement.amount();
        assert(token.transfer(insurance.beneficiary, amount));

        ReimbursementPaid(insurance.beneficiary, agreement, amount);
    }

    function approve(Agreement agreement) public onlyOwner {
        triage(agreement, true);
        ReimbursementApproved(agreement);
    }

    function reject(Agreement agreement) public onlyOwner {
        triage(agreement, false);
        ReimbursementRejected(agreement);
    }

    function triage(Agreement agreement, bool approveReimbursement) private {
        require (agreement != address(0x0));

        InsuranceDetails storage insurance = insuredAgreements[agreement];
        require (insurance.status == Status.ReimbursementRequested);

        insurance.status = approveReimbursement ? Status.ReimbursementApproved : Status.ReimbursementRejected;
    }
}