const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            required: true,
            min: 0
        },

        maxScore: {
            type: Number,
            required: true,
            min: 0
        },

        evidence: {
            type: String,
            default: ""
        },

        concern: {
            type: String,
            default: ""
        },

        suggestion: {
            type: String,
            default: ""
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0
        }
    },
    {
        _id: false
    }
);

const evaluationSchema = new mongoose.Schema(
    {
        attemptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attempt",
            required: true,
            unique: true,
            index: true
        },

        status: {
            type: String,
            enum: ["COMPLETED", "FAILED"],
            required: true
        },

        overallScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        },

        criteria: {
            type: [criterionSchema],
            default: []
        },

        strengths: {
            type: [String],
            default: []
        },

        improvements: {
            type: [String],
            default: []
        },

        errorMessage: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);