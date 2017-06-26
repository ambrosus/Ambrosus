var DeliveryContract = artifacts.require("./DeliveryContract.sol");
var Qualit = artifacts.require("./Qualit.sol");
var Contribution = artifacts.require("./Contribution.sol");

module.exports = function(deployer) {
    deployer.deploy(Contribution);
    deployer.deploy(Qualit).then(function() {
        return deployer.deploy(DeliveryContract, "The Name", "The Code", Qualit.address);
    });
};
