class EvaluationController {
    constructor(
        evaluationRepository,
        attemptRepository
    ) {
        this.evaluationRepository =
            evaluationRepository;

        this.attemptRepository =
            attemptRepository;
    }

    getEvaluation = async (req, res, next) => {
        try {
            const userId =
                req.headers["x-user-id"] || "demo-user";

            const attempt =
                await this.attemptRepository.findById(
                    req.params.id
                );

            if (!attempt) {
                res.status(404).json({
                    success: false,
                    message: "Attempt not found"
                });

                return;
            }

            if (attempt.userId !== userId) {
                res.status(403).json({
                    success: false,
                    message:
                        "You do not have access to this evaluation"
                });

                return;
            }

            const evaluation =
                await this.evaluationRepository
                    .findByAttemptId(req.params.id);

            if (!evaluation) {
                res.status(404).json({
                    success: false,
                    message: "Evaluation not found"
                });

                return;
            }

            res.json({
                success: true,
                data: evaluation
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = EvaluationController;  