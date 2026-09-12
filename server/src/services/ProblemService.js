class ProblemService {
    constructor(problemRepository) {
        this.problemRepository = problemRepository;
    }

    async getProblems() {
        return this.problemRepository.findAllActive();
    }

    async getProblemById(id) {
        const problem = await this.problemRepository.findById(id);

        if (!problem) {
            const error = new Error("Problem not found");
            error.statusCode = 404;
            throw error;
        }

        return problem;
    }
}

module.exports = ProblemService;