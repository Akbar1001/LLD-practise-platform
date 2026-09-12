const EvaluationModel = require("../models/EvaluationModel");

class EvaluationRepository {
    async create(evaluationData) {
        return EvaluationModel.create(evaluationData);
    }

    async findByAttemptId(attemptId) {
        return EvaluationModel
            .findOne({ attemptId })
            .lean();
    }
}

module.exports = EvaluationRepository;