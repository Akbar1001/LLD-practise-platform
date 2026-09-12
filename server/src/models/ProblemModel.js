const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
            required: true
        },

        description: {
            type: String,
            required: true
        },

        requirements: {
            type: [String],
            default: []
        },

        constraints: {
            type: [String],
            default: []
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Problem", problemSchema);