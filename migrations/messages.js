const messages = artifacts.require("messages");

module.exports = function(deployer) {
  // Deploy the messages contract
  deployer.deploy(messages);
};
