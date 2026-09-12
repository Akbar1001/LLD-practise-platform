const test = require("node:test");
const assert = require("node:assert/strict");

const {
    Attempt,
    ATTEMPT_STATUS
} = require("../src/domain/Attempt");

const RuleBasedEvaluator =
    require("../src/evaluators/RuleBasedEvaluator");

test("rule based evaluator evaluates a complete submission", () => {
    const attempt = new Attempt({
        id: "attempt-1",
        userId: "demo-user",
        problemId: "problem-1"
    });

    attempt.saveSubmission({
        classesAndResponsibilities:
            "ParkingLot manages parking spots. Vehicle represents a vehicle.",
        relationships:
            "ParkingLot contains ParkingSpot objects. ParkingSpot holds a Vehicle.",
        designDecisions:
            "Use an interface for Vehicle types and encapsulate parking allocation.",
        edgeCases:
            "Full parking lot, invalid vehicle, duplicate vehicle, missing vehicle"
    });

    const problem = {
        id: "problem-1",
        title: "Parking Lot System"
    };

    const evaluator = new RuleBasedEvaluator();

    const evaluation =
        evaluator.evaluate(attempt, problem);

    assert.equal(
        evaluation.criteria.length,
        5
    );

    assert.ok(
        evaluation.calculateScore() > 0
    );

    assert.ok(
        evaluation.strengths.length > 0
    );
});