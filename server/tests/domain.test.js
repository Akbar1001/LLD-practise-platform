const test = require("node:test");
const assert = require("node:assert");

const {
    Attempt,
    ATTEMPT_STATUS
} = require("../src/domain/Attempt");

test("new attempt starts as DRAFT", () => {
    const attempt = new Attempt({
        id: "attempt-1",
        userId: "user-1",
        problemId: "problem-1"
    });

    assert.strictEqual(attempt.status, ATTEMPT_STATUS.DRAFT);
});

test("complete submission can be submitted", () => {
    const attempt = new Attempt({
        id: "attempt-1",
        userId: "user-1",
        problemId: "problem-1"
    });

    attempt.saveSubmission({
        classesAndResponsibilities: "ParkingLot manages floors.",
        relationships: "ParkingLot contains ParkingFloor.",
        designDecisions: "Use strategy for spot allocation.",
        edgeCases: "No available parking spot."
    });

    attempt.submit();

    assert.strictEqual(
        attempt.status,
        ATTEMPT_STATUS.SUBMITTED
    );
});

test("incomplete submission cannot be submitted", () => {
    const attempt = new Attempt({
        id: "attempt-1",
        userId: "user-1",
        problemId: "problem-1"
    });

    assert.throws(() => {
        attempt.saveSubmission({
            classesAndResponsibilities: "ParkingLot"
        });
    });
});

test("submitted attempt cannot be submitted twice", () => {
    const attempt = new Attempt({
        id: "attempt-1",
        userId: "user-1",
        problemId: "problem-1"
    });

    attempt.saveSubmission({
        classesAndResponsibilities: "ParkingLot manages floors.",
        relationships: "ParkingLot contains floors.",
        designDecisions: "Use strategy.",
        edgeCases: "No spots."
    });

    attempt.submit();

    assert.throws(() => {
        attempt.submit();
    });
});

test("evaluation state transitions work", () => {
    const attempt = new Attempt({
        id: "attempt-1",
        userId: "user-1",
        problemId: "problem-1"
    });

    attempt.saveSubmission({
        classesAndResponsibilities: "ParkingLot manages floors.",
        relationships: "ParkingLot contains floors.",
        designDecisions: "Use strategy.",
        edgeCases: "No spots."
    });

    attempt.submit();
    attempt.startEvaluation();

    assert.strictEqual(
        attempt.status,
        ATTEMPT_STATUS.EVALUATING
    );

    attempt.completeEvaluation();

    assert.strictEqual(
        attempt.status,
        ATTEMPT_STATUS.COMPLETED
    );
});