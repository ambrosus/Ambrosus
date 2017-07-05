var DeliveryContract = artifacts.require("./DeliveryContract.sol");
var Amber = artifacts.require("./Amber.sol");
var Contribution = artifacts.require("./Contribution.sol");

module.exports = function(deployer) {
    deployer.deploy(Contribution);
    deployer.deploy(Amber).then(function() {
        return deployer.deploy(DeliveryContract, "The Name", "The Code", Amber.address);
    });
};
