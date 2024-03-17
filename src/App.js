import { Routes, Route } from "react-router-dom";
import "./App.scss";
import DashboardPage from "./features/dashboard/components/DashboardPage";
import Header from "./features/header/components/Header";
import Footer from "./features/footer/components/Footer";

const App = () => (
    <div className="App">
        <div className="layout">
            <Header />
            <main>
                <Routes>
                    <Route exact path="/" component={DashboardPage} />
                </Routes>
            </main>
            <Footer />
        </div>
    </div>
);

export default App;
