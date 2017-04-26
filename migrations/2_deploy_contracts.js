var DeliveryContract = artifacts.require("./DeliveryContract.sol");
var FoodToken = artifacts.require("./FoodToken.sol");

module.exports = function(deployer) {
  deployer.deploy(FoodToken).then(function() {
    return deployer.deploy(DeliveryContract, "The Name", "The Code", false, FoodToken.address);
  });
};
