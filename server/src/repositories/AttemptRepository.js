const AttemptModel = require("../models/AttemptModel");

class AttemptRepository {
    async create({ userId, problemId }) {
        return AttemptModel.create({
            userId,
            problemId
        });
    }

    async findById(id) {
        return AttemptModel
            .findById(id)
            .populate("problemId")
            .lean();
    }

    async findByUserId(userId) {
        return AttemptModel
            .find({ userId })
            .populate("problemId")
            .sort({ createdAt: -1 })
            .lean();
    }

    async updateSubmission(id, submission) {
        return AttemptModel.findByIdAndUpdate(
            id,
            {
                submission
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("problemId")
            .lean();
    }

    async updateStatus(id, status) {
        return AttemptModel.findByIdAndUpdate(
            id,
            {
                status
            },
            {
                new: true,
                runValidators: true
            }
        )
            .populate("problemId")
            .lean();
    }
}

module.exports = AttemptRepository;