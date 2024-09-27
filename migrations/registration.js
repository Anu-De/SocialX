const Registration = artifacts.require("Registration");

module.exports = function (deployer) {
  // Deploy the Registration contract
  deployer.deploy(Registration);
};
