const voting = artifacts.require("voting");

module.exports = function(deployer) {
  // Deploy the Create contract
  deployer.deploy(voting);
};
