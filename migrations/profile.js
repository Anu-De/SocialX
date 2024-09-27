const profile = artifacts.require("profile");

module.exports = function(deployer) {
  // Deploy the Profile contract
  deployer.deploy(profile);
};
