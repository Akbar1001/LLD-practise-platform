const mongoose = require("mongoose");

const {
    Attempt,
    ATTEMPT_STATUS
} = require("../domain/Attempt");

class AttemptService {
    constructor(attemptRepository, problemRepository) {
        this.attemptRepository = attemptRepository;
        this.problemRepository = problemRepository;
    }

    async createAttempt({ userId, problemId }) {
        if (!mongoose.isValidObjectId(problemId)) {
            const error = new Error("Invalid problem ID");
            error.statusCode = 400;
            throw error;
        }

        const problem = await this.problemRepository.findById(problemId);

        if (!problem) {
            const error = new Error("Problem not found");
            error.statusCode = 404;
            throw error;
        }

        return this.attemptRepository.create({
            userId,
            problemId
        });
    }

    async getAttemptById({ attemptId, userId }) {
        if (!mongoose.isValidObjectId(attemptId)) {
            const error = new Error("Invalid attempt ID");
            error.statusCode = 400;
            throw error;
        }

        const attempt = await this.attemptRepository.findById(attemptId);

        if (!attempt) {
            const error = new Error("Attempt not found");
            error.statusCode = 404;
            throw error;
        }

        if (attempt.userId !== userId) {
            const error = new Error("You do not have access to this attempt");
            error.statusCode = 403;
            throw error;
        }

        return attempt;
    }

    async saveSubmission({
        attemptId,
        userId,
        submissionData
    }) {
        const attemptData = await this.getAttemptById({
            attemptId,
            userId
        });

        const attempt = this.toDomain(attemptData);

        attempt.saveSubmission(submissionData);

        return this.attemptRepository.updateSubmission(
            attemptId,
            attempt.submission
        );
    }

    async submitAttempt({
        attemptId,
        userId
    }) {
        const attemptData = await this.getAttemptById({
            attemptId,
            userId
        });

        const attempt = this.toDomain(attemptData);

        attempt.submit();

        return this.attemptRepository.updateStatus(
            attemptId,
            attempt.status
        );
    }

    toDomain(attemptData) {
        return new Attempt({
            id: attemptData._id.toString(),
            userId: attemptData.userId,
            problemId:
                attemptData.problemId?._id?.toString() ||
                attemptData.problemId?.toString(),
            submission: attemptData.submission,
            status: attemptData.status
        });
    }
}

module.exports = AttemptService;