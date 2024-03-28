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
				"9f9b8dded43948b1f47025da32d57a35afc807bb4b3a28e1840b91ed510f4858",
			],
		},
	},
};
