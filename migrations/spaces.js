const spaces = artifacts.require("spaces");

module.exports = function(deployer) {
  // Deploy the Create contract
  deployer.deploy(spaces);
};
