/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");

module.exports = {
	solidity: "0.8.4",
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {},
		ganache: {
			url: "http://127.0.0.1:7545",
			accounts: [
				"dd0a3b686bab9f62854ffc1357344b2b99c97b45681dd2a1f2e1d197ed1d0bd2",
			],
		},
	},
};
