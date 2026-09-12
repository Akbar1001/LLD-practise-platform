import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/api";
import Loading from "../components/Loading";

function PracticePage() {
    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response =
                    await api.get(
                        `/problems/${problemId}`
                    );

                setProblem(response.data.data);
            } catch (error) {
                setError(
                    "Unable to load this problem."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [problemId]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        );
    }

    return (
        <div className="page">
            <div className="practice-header">
                <div>
                    <span
                        className={`difficulty ${problem.difficulty.toLowerCase()}`}
                    >
                        {problem.difficulty}
                    </span>

                    <h1>{problem.title}</h1>

                    <p>{problem.description}</p>
                </div>
            </div>

            <section className="problem-section">
                <h2>Requirements</h2>

                <ul>
                    {problem.requirements.map(
                        (requirement, index) => (
                            <li key={index}>
                                {requirement}
                            </li>
                        )
                    )}
                </ul>
            </section>

            <section className="problem-section">
                <h2>Constraints</h2>

                <ul>
                    {problem.constraints.map(
                        (constraint, index) => (
                            <li key={index}>
                                {constraint}
                            </li>
                        )
                    )}
                </ul>
            </section>
        </div>
    );
}

export default PracticePage;