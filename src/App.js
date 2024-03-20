import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/layout";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import DashboardPage from "./routes/dashboard/DashboardPage";
import BecomeAProPage from "./routes/pro/BecomeAProPage";
import ProServicesPage from "./routes/services-page/ProServicesPage";
import ServiceProvidersPage from "./routes/serviceProviders/ServiceProvidersPage";
import ClientContractsPage from "./routes/serviceContracts/ClientContractsPage";
import ServiceProviderAgreementsPage from "./routes/serviceAgreements/ServiceProviderAgreementsPage";

const App = () => (
	<div
		className="App"
		style={{ height: "100vh", margin: "0", padding: "0", overflowY: "auto" }}>
		<Header />
		<Box as="main" h="100%">
			<Routes>
				<Route exact path="/" element={<DashboardPage />} />
				<Route exact path="/pro" element={<BecomeAProPage />} />
				<Route exact path="/my-services" element={<ProServicesPage />} />
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
					element={<ServiceProviderAgreementsPage />}
				/>
			</Routes>
		</Box>
		<Footer />
	</div>
);

export default App;
