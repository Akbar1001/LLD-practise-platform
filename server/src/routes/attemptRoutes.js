const express = require("express");

const AttemptRepository = require("../repositories/AttemptRepository");
const ProblemRepository = require("../repositories/ProblemRepository");

const AttemptService = require("../services/AttemptService");
const AttemptController = require("../controllers/AttemptController");

const router = express.Router();

const attemptRepository = new AttemptRepository();
const problemRepository = new ProblemRepository();

const attemptService = new AttemptService(
    attemptRepository,
    problemRepository
);

const attemptController = new AttemptController(attemptService);

router.post("/", attemptController.createAttempt);

router.get("/:id", attemptController.getAttemptById);

router.put(
    "/:id/submission",
    attemptController.saveSubmission
);

router.post(
    "/:id/submit",
    attemptController.submitAttempt
);

module.exports = router;