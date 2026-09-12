class AttemptController {
    constructor(attemptService) {
        this.attemptService = attemptService;
    }

    createAttempt = async (req, res, next) => {
        try {
            const userId =
                req.headers["x-user-id"] || "demo-user";

            const { problemId } = req.body;

            if (!problemId) {
                const error =
                    new Error("problemId is required");

                error.statusCode = 400;

                throw error;
            }

            const attempt =
                await this.attemptService.createAttempt({
                    userId,
                    problemId
                });

            res.status(201).json({
                success: true,
                data: attempt
            });
        } catch (error) {
            next(error);
        }
    };

    getAttempts = async (req, res, next) => {
        try {
            const userId =
                req.headers["x-user-id"] || "demo-user";

            const attempts =
                await this.attemptService.getAttempts(
                    userId
                );

            res.json({
                success: true,
                data: attempts
            });
        } catch (error) {
            next(error);
        }
    };

    getAttemptById = async (req, res, next) => {
        try {
            const userId =
                req.headers["x-user-id"] || "demo-user";

            const attempt =
                await this.attemptService.getAttemptById({
                    attemptId: req.params.id,
                    userId
                });

            res.json({
                success: true,
                data: attempt
            });
        } catch (error) {
            next(error);
        }
    };

    saveSubmission = async (req, res, next) => {
        try {
            const userId =
                req.headers["x-user-id"] || "demo-user";

            const {
                classesAndResponsibilities,
                relationships,
                designDecisions,
                edgeCases
            } = req.body;

            const attempt =
                await this.attemptService.saveSubmission({
                    attemptId: req.params.id,
                    userId,

                    submissionData: {
                        classesAndResponsibilities,
                        relationships,
                        designDecisions,
                        edgeCases
                    }
                });

            res.json({
                success: true,
                data: attempt
            });
        } catch (error) {
            next(error);
        }
    };

    submitAttempt = async (req, res, next) => {
        try {
            const userId =
                req.headers["x-user-id"] || "demo-user";

            const attempt =
                await this.attemptService.submitAttempt({
                    attemptId: req.params.id,
                    userId
                });

            res.json({
                success: true,
                data: attempt
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = AttemptController;