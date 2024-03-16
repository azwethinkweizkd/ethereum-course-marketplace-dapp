import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import WalletProvider from "./common/context/walletProvider.js";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const [wallet, setWallet] = React.useState({
    accounts: []
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <WalletProvider.Provider value={{ wallet, setWallet }}>
                <App />
            </WalletProvider.Provider>
        </Router>
    </React.StrictMode>
);
