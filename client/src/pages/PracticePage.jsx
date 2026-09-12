import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/api";
import Loading from "../components/Loading";

function PracticePage() {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [attempt, setAttempt] = useState(null);

    const [form, setForm] = useState({
        classesAndResponsibilities: "",
        relationships: "",
        designDecisions: "",
        edgeCases: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const initializePractice = async () => {
            try {
                setLoading(true);

                // Load problem
                const problemResponse =
                    await api.get(
                        `/problems/${problemId}`
                    );

                setProblem(
                    problemResponse.data.data
                );

                // Create draft attempt
                const attemptResponse =
                    await api.post(
                        "/attempts",
                        {
                            problemId
                        }
                    );

                const createdAttempt =
                    attemptResponse.data.data;

                setAttempt(createdAttempt);
            } catch (error) {
                console.error(error);

                setError(
                    "Unable to start this practice session."
                );
            } finally {
                setLoading(false);
            }
        };

        initializePractice();
    }, [problemId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const saveSubmission = async () => {
        if (!attempt) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response =
                await api.put(
                    `/attempts/${attempt._id}/submission`,
                    form
                );

            setAttempt(response.data.data);

            return true;
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save your solution."
            );

            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        if (!attempt) {
            return;
        }

        const isSaved =
            await saveSubmission();

        if (!isSaved) {
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            await api.post(
                `/attempts/${attempt._id}/submit`
            );

            navigate(
                `/evaluation/${attempt._id}`
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to submit your solution."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error && !problem) {
        return (
            <div className="page">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="page practice-page">
            <div className="practice-layout">

                {/* Problem */}
                <aside className="problem-panel">
                    <div className="sticky-panel">
                        <span
                            className={`difficulty ${problem.difficulty.toLowerCase()}`}
                        >
                            {problem.difficulty}
                        </span>

                        <h1>{problem.title}</h1>

                        <p className="problem-description">
                            {problem.description}
                        </p>

                        <div className="problem-section">
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
                        </div>

                        <div className="problem-section">
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
                        </div>
                    </div>
                </aside>


                {/* Submission */}
                <section className="submission-panel">
                    <div className="submission-header">
                        <div>
                            <p className="eyebrow">
                                Your Solution
                            </p>

                            <h2>
                                Design your solution
                            </h2>

                            <p>
                                Focus on responsibilities,
                                relationships, design
                                decisions, and edge cases.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="editor-card">

                        <div className="editor-section">
                            <label>
                                <span>
                                    1. Classes & Responsibilities
                                </span>

                                <small>
                                    What classes would you
                                    create and what is each
                                    responsible for?
                                </small>
                            </label>

                            <textarea
                                name="classesAndResponsibilities"
                                value={
                                    form.classesAndResponsibilities
                                }
                                onChange={handleChange}
                                placeholder={
                                    "Example:\n\nParkingLot — manages parking spots and vehicle allocation.\nVehicle — represents a vehicle entering the parking lot.\nParkingSpot — represents an individual parking position."
                                }
                            />
                        </div>


                        <div className="editor-section">
                            <label>
                                <span>
                                    2. Relationships
                                </span>

                                <small>
                                    Explain how your classes
                                    collaborate with each
                                    other.
                                </small>
                            </label>

                            <textarea
                                name="relationships"
                                value={
                                    form.relationships
                                }
                                onChange={handleChange}
                                placeholder={
                                    "Example:\n\nParkingLot contains multiple ParkingSpot objects. A ParkingSpot can hold one Vehicle."
                                }
                            />
                        </div>


                        <div className="editor-section">
                            <label>
                                <span>
                                    3. Design Decisions
                                </span>

                                <small>
                                    Explain why you chose
                                    this design and how it
                                    could evolve.
                                </small>
                            </label>

                            <textarea
                                name="designDecisions"
                                value={
                                    form.designDecisions
                                }
                                onChange={handleChange}
                                placeholder={
                                    "Example:\n\nUse an abstraction for Vehicle so new vehicle types can be introduced without changing parking allocation logic."
                                }
                            />
                        </div>


                        <div className="editor-section">
                            <label>
                                <span>
                                    4. Edge Cases
                                </span>

                                <small>
                                    What unusual or failure
                                    scenarios should the
                                    design handle?
                                </small>
                            </label>

                            <textarea
                                name="edgeCases"
                                value={
                                    form.edgeCases
                                }
                                onChange={handleChange}
                                placeholder={
                                    "Example:\n\nParking lot is full, vehicle already parked, invalid vehicle type, vehicle not found while exiting."
                                }
                            />
                        </div>


                        <div className="editor-actions">
                            <button
                                className="secondary-button"
                                onClick={saveSubmission}
                                disabled={
                                    saving ||
                                    submitting
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Draft"}
                            </button>

                            <button
                                className="primary-button"
                                onClick={handleSubmit}
                                disabled={
                                    saving ||
                                    submitting
                                }
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Solution"}
                            </button>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}

export default PracticePage;