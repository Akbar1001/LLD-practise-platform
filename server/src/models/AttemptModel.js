const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        classesAndResponsibilities: {
            type: String,
            required: true
        },

        relationships: {
            type: String,
            required: true
        },

        designDecisions: {
            type: String,
            required: true
        },

        edgeCases: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);

const attemptSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },

        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
            index: true
        },

        submission: {
            type: submissionSchema,
            default: null
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "SUBMITTED",
                "EVALUATING",
                "COMPLETED",
                "FAILED"
            ],
            default: "DRAFT",
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attempt", attemptSchema);