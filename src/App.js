import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/layout";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import DashboardPage from "./routes/dashboard/DashboardPage";
import BecomeAProPage from "./routes/pro/BecomeAProPage";
import ProServicesPage from "./routes/services/ProServicesPage";

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
			</Routes>
		</Box>
		<Footer />
	</div>
);

export default App;
