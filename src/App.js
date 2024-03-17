import { Routes, Route } from "react-router-dom";
import DashboardPage from "./routes/dashboard/DashboardPage";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { Box } from "@chakra-ui/layout";

const App = () => (
	<div className="App" style={{ height: "100vh" }}>
		<Header />
		<Box as="main" h="100%">
			<Routes>
				<Route exact path="/" element={<DashboardPage />} />
			</Routes>
		</Box>
		<Footer />
	</div>
);

export default App;
