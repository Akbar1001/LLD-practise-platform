const {
    Attempt
} = require("../domain/Attempt");

const Submission =
    require("../domain/Submission");

class EvaluationService {
    constructor(
        attemptRepository,
        problemRepository,
        evaluationRepository,
        evaluator
    ) {
        this.attemptRepository =
            attemptRepository;

        this.problemRepository =
            problemRepository;

        this.evaluationRepository =
            evaluationRepository;

        this.evaluator =
            evaluator;
    }

    async evaluateAttempt(attemptId) {
        const attemptData =
            await this.attemptRepository.findById(
                attemptId
            );

        if (!attemptData) {
            throw new Error(
                "Attempt not found"
            );
        }

        const attempt =
            this.toDomain(attemptData);

        const problem =
            await this.problemRepository.findById(
                attempt.problemId
            );

        if (!problem) {
            throw new Error(
                "Problem not found"
            );
        }

        attempt.startEvaluation();

        await this.attemptRepository.updateStatus(
            attemptId,
            attempt.status
        );

        try {
            const evaluation =
                this.evaluator.evaluate(
                    attempt,
                    problem
                );

            const overallScore =
                evaluation.calculateScore();

            await this.evaluationRepository.create({
                attemptId,

                status: "COMPLETED",

                overallScore,

                criteria:
                    evaluation.criteria,

                strengths:
                    evaluation.strengths,

                improvements:
                    evaluation.improvements
            });

            attempt.completeEvaluation();

            await this.attemptRepository.updateStatus(
                attemptId,
                attempt.status
            );

            return evaluation;
        } catch (error) {
            attempt.failEvaluation();

            await this.attemptRepository.updateStatus(
                attemptId,
                attempt.status
            );

            await this.evaluationRepository.create({
                attemptId,

                status: "FAILED",

                errorMessage:
                    error.message
            });

            throw error;
        }
    }

    toDomain(attemptData) {
        let submission = null;

        if (attemptData.submission) {
            submission =
                new Submission({
                    classesAndResponsibilities:
                        attemptData.submission
                            .classesAndResponsibilities,

                    relationships:
                        attemptData.submission
                            .relationships,

                    designDecisions:
                        attemptData.submission
                            .designDecisions,

                    edgeCases:
                        attemptData.submission
                            .edgeCases
                });
        }

        return new Attempt({
            id:
                attemptData._id.toString(),

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

module.exports = EvaluationService;