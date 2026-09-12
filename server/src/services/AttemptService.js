const mongoose = require("mongoose");

const {
    Attempt
} = require("../domain/Attempt");

const Submission = require("../domain/Submission");

class AttemptService {
    constructor(
        attemptRepository,
        problemRepository,
        evaluationService
    ) {
        this.attemptRepository = attemptRepository;
        this.problemRepository = problemRepository;
        this.evaluationService = evaluationService;
    }

    async createAttempt({ userId, problemId }) {
        if (!mongoose.isValidObjectId(problemId)) {
            const error = new Error("Invalid problem ID");
            error.statusCode = 400;
            throw error;
        }

        const problem =
            await this.problemRepository.findById(problemId);

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

    async getAttempts(userId) {
        return this.attemptRepository.findByUserId(userId);
    }

    async getAttemptById({ attemptId, userId }) {
        if (!mongoose.isValidObjectId(attemptId)) {
            const error = new Error("Invalid attempt ID");
            error.statusCode = 400;
            throw error;
        }

        const attempt =
            await this.attemptRepository.findById(attemptId);

        if (!attempt) {
            const error = new Error("Attempt not found");
            error.statusCode = 404;
            throw error;
        }

        if (attempt.userId !== userId) {
            const error = new Error(
                "You do not have access to this attempt"
            );

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
        const attemptData =
            await this.getAttemptById({
                attemptId,
                userId
            });

        const attempt =
            this.toDomain(attemptData);

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
        const attemptData =
            await this.getAttemptById({
                attemptId,
                userId
            });

        const attempt =
            this.toDomain(attemptData);

        attempt.submit();

        await this.attemptRepository.updateStatus(
            attemptId,
            attempt.status
        );

        /*
         * Start evaluation asynchronously.
         *
         * We intentionally don't await this because the
         * HTTP request should not be blocked by evaluation.
         */
        setImmediate(async () => {
            try {
                await this.evaluationService.evaluateAttempt(
                    attemptId
                );
            } catch (error) {
                console.error(
                    `Evaluation failed for attempt ${attemptId}:`,
                    error.message
                );
            }
        });

        return {
            ...attemptData,
            status: attempt.status
        };
    }

    toDomain(attemptData) {
        let submission = null;

        if (attemptData.submission) {
            submission = new Submission({
                classesAndResponsibilities:
                    attemptData.submission
                        .classesAndResponsibilities,

                relationships:
                    attemptData.submission.relationships,

                designDecisions:
                    attemptData.submission.designDecisions,

                edgeCases:
                    attemptData.submission.edgeCases
            });
        }

        return new Attempt({
            id: attemptData._id.toString(),

            userId:
                attemptData.userId,

            problemId:
                attemptData.problemId?._id?.toString() ||
                attemptData.problemId?.toString(),

            submission,

            status:
                attemptData.status
        });
    }
}

module.exports = AttemptService;