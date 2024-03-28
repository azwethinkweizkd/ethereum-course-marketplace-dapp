import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/layout";
import useEthereum from "./routes/shared/hooks/useEthereum";
import { useWallet } from "./common/context/walletProvider";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import DashboardPage from "./routes/dashboard/DashboardPage";
import BecomeAProPage from "./routes/pro/BecomeAProPage";
import ProServicesPage from "./routes/services-page/ProServicesPage";
import ServiceProvidersPage from "./routes/serviceProviders/ServiceProvidersPage";
import ClientContractsPage from "./routes/serviceContracts/ClientContractsPage";
import ServiceProviderAgreementsPage from "./routes/serviceAgreements/ServiceProviderAgreementsPage";

const App = () => {
	const [existingServiceProvider, setExistingServiceProvider] = useState(null);
	const { wallet } = useWallet();
	const ethereumApi = useEthereum();

	useEffect(() => {
		async function getServiceProvider(api) {
			return await api.current.getServiceProvider(wallet?.accounts[0]);
		}
		if (wallet?.accounts && wallet?.accounts.length) {
			getServiceProvider(ethereumApi)
				.then((serviceProvider) => {
					setExistingServiceProvider(serviceProvider);
				})
				.catch(() => {
					setExistingServiceProvider(null);
				});
		}
	}, [wallet?.accounts, ethereumApi]);

	return (
		<div
			className="App"
			style={{ height: "100vh", margin: "0", padding: "0", overflowY: "auto" }}>
			<Header />
			<Box as="main" h="100%">
				<Routes>
					<Route exact path="/" element={<DashboardPage />} />
					<Route
						exact
						path="/pro"
						element={
							existingServiceProvider ? (
								<Navigate to="/my-services" />
							) : (
								<BecomeAProPage />
							)
						}
					/>
					<Route
						exact
						path="/my-services"
						element={
							existingServiceProvider ? (
								<ProServicesPage />
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						exact
						path="/service-providers"
						element={<ServiceProvidersPage />}
					/>
					<Route
						exact
						path="/service-contracts"
						element={<ClientContractsPage />}
					/>
					<Route
						exact
						path="/service-agreements"
						element={
							existingServiceProvider ? (
								<ServiceProviderAgreementsPage />
							) : (
								<Navigate to="/" />
							)
						}
					/>
				</Routes>
			</Box>
			<Footer />
		</div>
	);
};

export default App;
