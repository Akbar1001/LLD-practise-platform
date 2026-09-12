class ProblemController {
    constructor(problemService) {
        this.problemService = problemService;
    }

    getProblems = async (req, res, next) => {
        try {
            const problems = await this.problemService.getProblems();

            res.json({
                success: true,
                data: problems
            });
        } catch (error) {
            next(error);
        }
    };

    getProblemById = async (req, res, next) => {
        try {
            const problem = await this.problemService.getProblemById(
                req.params.id
            );

            res.json({
                success: true,
                data: problem
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ProblemController;