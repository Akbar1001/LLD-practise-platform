import { useNavigate } from "react-router-dom";

function ProblemCard({ problem }) {
    const navigate = useNavigate();

    return (
        <div className="problem-card">
            <div className="problem-card-header">
                <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                </span>
            </div>

            <h3>{problem.title}</h3>

            <p>{problem.description}</p>

            <button
                onClick={() =>
                    navigate(`/practice/${problem._id}`)
                }
            >
                Start Practice
            </button>
        </div>
    );
}

export default ProblemCard;