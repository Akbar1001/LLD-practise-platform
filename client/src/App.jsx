import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import ProblemsPage from "./pages/ProblemsPage";
import PracticePage from "./pages/PracticePage";
import EvaluationPage from "./pages/EvaluationPage";
import AttemptsPage from "./pages/AttemptsPage";

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <nav className="navbar">
                    <Link
                        to="/"
                        className="logo"
                    >
                        LLD Practice
                    </Link>

                    <div className="nav-links">
                        <Link to="/">
                            Problems
                        </Link>

                        <Link to="/attempts">
                            My Attempts
                        </Link>
                    </div>
                </nav>

                <main>
                    <Routes>
                        <Route
                            path="/"
                            element={<ProblemsPage />}
                        />

                        <Route
                            path="/practice/:problemId"
                            element={<PracticePage />}
                        />

                        <Route
                            path="/evaluation/:attemptId"
                            element={<EvaluationPage />}
                        />

                        <Route
                            path="/attempts"
                            element={<AttemptsPage />}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;