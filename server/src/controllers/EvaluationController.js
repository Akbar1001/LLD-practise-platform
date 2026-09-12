class EvaluationController {
    constructor(evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    getEvaluation = async (req, res, next) => {
        try {
            const evaluation =
                await this.evaluationRepository.findByAttemptId(
                    req.params.id
                );

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