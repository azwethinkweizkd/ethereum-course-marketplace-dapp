import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "./common/context/walletProvider";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<WalletProvider>
			<ChakraProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ChakraProvider>
		</WalletProvider>
	</React.StrictMode>
);
