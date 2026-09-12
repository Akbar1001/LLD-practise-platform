import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/api";
import Loading from "../components/Loading";

function EvaluationPage() {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [evaluation, setEvaluation] = useState(null);
    const [attempt, setAttempt] = useState(null);

    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let intervalId;

        const fetchEvaluation = async () => {
            try {
                // First get the attempt
                const attemptResponse =
                    await api.get(
                        `/attempts/${attemptId}`
                    );

                const attemptData =
                    attemptResponse.data.data;

                setAttempt(attemptData);

                // Then try to get evaluation
                try {
                    const evaluationResponse =
                        await api.get(
                            `/attempts/${attemptId}/evaluation`
                        );

                    setEvaluation(
                        evaluationResponse.data.data
                    );

                    setEvaluating(false);
                    setLoading(false);

                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                } catch (evaluationError) {
                    // Evaluation may not exist yet because
                    // the asynchronous evaluator is running.
                    if (
                        evaluationError.response?.status ===
                        404
                    ) {
                        setEvaluating(true);
                        setLoading(false);
                    } else {
                        throw evaluationError;
                    }
                }
            } catch (error) {
                console.error(error);

                setError(
                    "Unable to load the evaluation."
                );

                setLoading(false);
            }
        };

        fetchEvaluation();

        // Check every 1.5 seconds while evaluation
        // is being generated.
        intervalId = setInterval(
            fetchEvaluation,
            1500
        );

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [attemptId]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    if (evaluating || !evaluation) {
        return (
            <div className="page evaluation-page">
                <div className="evaluation-loading">
                    <div className="loading-spinner">
                        ...
                    </div>

                    <p className="eyebrow">
                        Evaluation in progress
                    </p>

                    <h1>
                        Reviewing your design
                    </h1>

                    <p>
                        We're analyzing your classes,
                        relationships, design decisions,
                        and edge cases.
                    </p>

                    <div className="evaluation-status">
                        EVALUATING
                    </div>
                </div>
            </div>
        );
    }

    const problemTitle =
        attempt?.problemId?.title ||
        "LLD Problem";

    const score =
        evaluation.overallScore ?? 0;

    return (
        <div className="page evaluation-page">

            {/* Header */}
            <div className="evaluation-header">
                <div>
                    <p className="eyebrow">
                        Evaluation
                    </p>

                    <h1>
                        {problemTitle}
                    </h1>

                    <p>
                        Here's how your design performed
                        against the LLD evaluation rubric.
                    </p>
                </div>

                <div className="score-card">
                    <span>Overall Score</span>

                    <strong>
                        {score}
                    </strong>

                    <small>
                        out of 100
                    </small>
                </div>
            </div>


            {/* Strengths */}
            {evaluation.strengths?.length > 0 && (
                <section className="feedback-section">
                    <div className="section-heading">
                        <h2>
                            What you did well
                        </h2>

                        <p>
                            Strong areas identified in
                            your submission.
                        </p>
                    </div>

                    <div className="strength-list">
                        {evaluation.strengths.map(
                            (strength, index) => (
                                <div
                                    className="strength-item"
                                    key={index}
                                >
                                    <span className="check">
                                        ✓
                                    </span>

                                    <span>
                                        {strength}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}


            {/* Criteria */}
            <section className="feedback-section">
                <div className="section-heading">
                    <h2>
                        Evaluation Breakdown
                    </h2>

                    <p>
                        Each area includes evidence,
                        concerns, and suggestions.
                    </p>
                </div>

                <div className="criteria-list">
                    {evaluation.criteria?.map(
                        (criterion) => {
                            const percentage =
                                criterion.maxScore > 0
                                    ? (
                                        criterion.score /
                                        criterion.maxScore
                                    ) * 100
                                    : 0;

                            return (
                                <div
                                    className="criterion-card"
                                    key={criterion.key}
                                >
                                    <div className="criterion-header">
                                        <div>
                                            <h3>
                                                {
                                                    criterion.name
                                                }
                                            </h3>

                                            <div className="score-bar">
                                                <div
                                                    className="score-bar-fill"
                                                    style={{
                                                        width:
                                                            `${percentage}%`
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="criterion-score">
                                            <strong>
                                                {
                                                    criterion.score
                                                }
                                            </strong>

                                            <span>
                                                /
                                                {
                                                    criterion.maxScore
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="criterion-content">

                                        {criterion.evidence && (
                                            <div>
                                                <h4>
                                                    Evidence
                                                </h4>

                                                <p>
                                                    {
                                                        criterion.evidence
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {criterion.concern && (
                                            <div>
                                                <h4>
                                                    Concern
                                                </h4>

                                                <p>
                                                    {
                                                        criterion.concern
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {criterion.suggestion && (
                                            <div>
                                                <h4>
                                                    How to improve
                                                </h4>

                                                <p>
                                                    {
                                                        criterion.suggestion
                                                    }
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                    <div className="confidence">
                                        Evaluation confidence:
                                        {" "}
                                        {Math.round(
                                            criterion.confidence *
                                            100
                                        )}
                                        %
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </section>


            {/* Improvements */}
            {evaluation.improvements?.length > 0 && (
                <section className="feedback-section">
                    <div className="section-heading">
                        <h2>
                            Focus areas
                        </h2>

                        <p>
                            Things worth improving in
                            your next attempt.
                        </p>
                    </div>

                    <div className="improvement-list">
                        {evaluation.improvements.map(
                            (improvement, index) => (
                                <div
                                    className="improvement-item"
                                    key={index}
                                >
                                    <span>
                                        {index + 1}
                                    </span>

                                    <p>
                                        {improvement}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}


            {/* Actions */}
            <div className="evaluation-actions">
                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate("/attempts")
                    }
                >
                    My Attempts
                </button>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            `/practice/${attempt.problemId._id}`
                        )
                    }
                >
                    Try Again
                </button>
            </div>

        </div>
    );
}

export default EvaluationPage;