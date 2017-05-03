var DeliveryContract = artifacts.require("./DeliveryContract.sol");
var FoodToken = artifacts.require("./FoodToken.sol");
var Contribution = artifacts.require("./Contribution.sol");

module.exports = function(deployer) {
    deployer.deploy(Contribution);
    deployer.deploy(FoodToken).then(function() {
        return deployer.deploy(DeliveryContract, "The Name", "The Code", FoodToken.address);
    });
};
