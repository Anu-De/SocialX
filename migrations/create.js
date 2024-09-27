const Create = artifacts.require("Create");


module.exports = function(deployer) {
  // Deploy the Create contract
  deployer.deploy(Create);
};
