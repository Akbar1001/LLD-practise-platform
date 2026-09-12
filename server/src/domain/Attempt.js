const Submission = require("./Submission");

const ATTEMPT_STATUS = {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    EVALUATING: "EVALUATING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED"
};

class Attempt {
    constructor({
        id,
        userId,
        problemId,
        submission = null,
        status = ATTEMPT_STATUS.DRAFT
    }) {
        this.id = id;
        this.userId = userId;
        this.problemId = problemId;
        this.submission = submission;
        this.status = status;
    }

    saveSubmission(submissionData) {
        if (this.status !== ATTEMPT_STATUS.DRAFT) {
            throw new Error("Only draft attempts can be modified");
        }

        const submission = new Submission(submissionData);

        if (!submission.isComplete()) {
            throw new Error("Submission is incomplete");
        }

        this.submission = submission;

        return this.submission;
    }

    submit() {
        if (this.status !== ATTEMPT_STATUS.DRAFT) {
            throw new Error("Only draft attempts can be submitted");
        }

        if (!this.submission || !this.submission.isComplete()) {
            throw new Error("Cannot submit an incomplete attempt");
        }

        this.status = ATTEMPT_STATUS.SUBMITTED;
    }

    startEvaluation() {
        if (this.status !== ATTEMPT_STATUS.SUBMITTED) {
            throw new Error("Only submitted attempts can be evaluated");
        }

        this.status = ATTEMPT_STATUS.EVALUATING;
    }

    completeEvaluation() {
        if (this.status !== ATTEMPT_STATUS.EVALUATING) {
            throw new Error("Attempt is not being evaluated");
        }

        this.status = ATTEMPT_STATUS.COMPLETED;
    }

    failEvaluation() {
        if (this.status !== ATTEMPT_STATUS.EVALUATING) {
            throw new Error("Attempt is not being evaluated");
        }

        this.status = ATTEMPT_STATUS.FAILED;
    }
}

module.exports = {
    Attempt,
    ATTEMPT_STATUS
};