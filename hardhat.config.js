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
				"baebeb9bbb538f378b6aed8c325d6ab207bc97ef627582bae457d50754dc7e6e",
			],
		},
	},
};
