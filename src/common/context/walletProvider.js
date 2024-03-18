import React, { createContext, useState, useContext } from "react";

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
	const [wallet, setWallet] = useState(null);

	return (
		<WalletContext.Provider value={{ wallet, setWallet }}>
			{children}
		</WalletContext.Provider>
	);
};
