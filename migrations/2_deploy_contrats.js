const Registration = artifacts.require("Registration");
const Create = artifacts.require("Create");

module.exports = function (deployer) {
  deployer.deploy(Registration);
};

module.exports = function(deployer) {
  // Deploy the Create contract
  deployer.deploy(Create);
};
