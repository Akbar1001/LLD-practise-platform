const ProblemModel = require("../models/ProblemModel");

class ProblemRepository {
    async findAllActive() {
        return ProblemModel
            .find({ active: true })
            .sort({ createdAt: 1 })
            .lean();
    }

    async findById(id) {
        return ProblemModel
            .findOne({
                _id: id,
                active: true
            })
            .lean();
    }

    async findBySlug(slug) {
        return ProblemModel
            .findOne({
                slug,
                active: true
            })
            .lean();
    }
}

module.exports = ProblemRepository;