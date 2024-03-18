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
				"23eecb14354f325ce87e70288faddc236e9e1fcb5aac2b94d3eb1bdba4c9ff21",
			],
		},
	},
};
