var DeliveryContract = artifacts.require("./DeliveryContract.sol");
var FoodCoin = artifacts.require("./FoodCoin.sol");
var Contribution = artifacts.require("./Contribution.sol");

module.exports = function(deployer) {
    deployer.deploy(Contribution);
    deployer.deploy(FoodCoin).then(function() {
        return deployer.deploy(DeliveryContract, "The Name", "The Code", FoodCoin.address);
    });
};
