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
                "5e7ccbb1dc590ee1cf18cd4c202facc5d284a27a43a77550b997d9f292cd7a6f"
            ]
        }
    }
};
