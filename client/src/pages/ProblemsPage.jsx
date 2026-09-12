import { useEffect, useState } from "react";

import api from "../api/api";
import ProblemCard from "../components/ProblemCard";
import Loading from "../components/Loading";

function ProblemsPage() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response =
                    await api.get("/problems");

                setProblems(response.data.data);
            } catch (error) {
                setError(
                    "Unable to load problems. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">
                        LLD Practice Platform
                    </p>

                    <h1>Choose a Problem</h1>

                    <p>
                        Practice object-oriented design by
                        solving realistic low-level design
                        problems.
                    </p>
                </div>
            </div>

            {loading && <Loading />}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="problem-grid">
                    {problems.map((problem) => (
                        <ProblemCard
                            key={problem._id}
                            problem={problem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProblemsPage;