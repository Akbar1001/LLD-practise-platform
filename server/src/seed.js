require("dotenv").config();

const mongoose = require("mongoose");
const connectDatabase = require("./config/database");
const Problem = require("./models/ProblemModel");

const problems = [
    {
        title: "Parking Lot System",
        slug: "parking-lot",
        difficulty: "BEGINNER",

        description:
            "Design a parking lot system that can manage vehicles entering and leaving a multi-floor parking facility. The system should assign suitable parking spots, track occupied spots, generate tickets, and calculate parking fees.",

        requirements: [
            "The parking lot can have multiple floors.",
            "Different vehicle types may require different parking spot types.",
            "A vehicle should be assigned a suitable available parking spot.",
            "The system should track occupied and available spots.",
            "A ticket should be generated when a vehicle enters.",
            "A parking fee should be calculated when the vehicle exits.",
            "The design should allow new vehicle or spot types to be added later."
        ],

        constraints: [
            "Focus on object-oriented design rather than database design.",
            "Explain the responsibilities of important classes.",
            "Consider how the design can evolve when requirements change."
        ],

        active: true
    },

    {
        title: "Vending Machine",
        slug: "vending-machine",
        difficulty: "INTERMEDIATE",

        description:
            "Design a vending machine that allows users to select products, insert money, purchase products, receive change, and handle invalid operations.",

        requirements: [
            "The machine contains multiple products with different prices.",
            "A user can select a product.",
            "A user can insert money.",
            "The machine should verify whether enough money was inserted.",
            "The machine should dispense the selected product.",
            "The machine should return appropriate change.",
            "The machine should handle unavailable products.",
            "The design should support adding new product types or payment mechanisms later."
        ],

        constraints: [
            "Consider the different states of a vending machine.",
            "Consider what happens when a user cancels a transaction.",
            "Consider insufficient funds and unavailable products."
        ],

        active: true
    },

    {
        title: "Elevator System",
        slug: "elevator-system",
        difficulty: "INTERMEDIATE",

        description:
            "Design an elevator system for a building with multiple floors and one or more elevators. Users can request elevators from floors and select destination floors.",

        requirements: [
            "The building can have multiple floors.",
            "There can be multiple elevators.",
            "Users can request an elevator from a floor.",
            "Users inside an elevator can select destination floors.",
            "The system should decide which elevator handles a request.",
            "The elevator should move between floors.",
            "The design should handle multiple pending requests.",
            "The elevator selection strategy should be replaceable."
        ],

        constraints: [
            "Consider how elevator requests are represented.",
            "Consider how elevators transition between states.",
            "Consider how the scheduling strategy can change later.",
            "Focus on class responsibilities and interactions."
        ],

        active: true
    }
];

const seedDatabase = async () => {
    try {
        await connectDatabase();

        await Problem.deleteMany({});

        const insertedProblems = await Problem.insertMany(problems);

        console.log(
            `Seeded ${insertedProblems.length} problems successfully`
        );

        insertedProblems.forEach((problem) => {
            console.log(`- ${problem.title}`);
        });
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();