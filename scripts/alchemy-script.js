const { Network, Alchemy } = require("alchemy-sdk");

const settings = {
	apiKey: "xLkdHvXwVeznII4M8nXTDhgzLEuKliCt",
	network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);
