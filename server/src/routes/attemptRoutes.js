const express = require("express");

const AttemptRepository =
    require("../repositories/AttemptRepository");

const ProblemRepository =
    require("../repositories/ProblemRepository");

const EvaluationRepository =
    require("../repositories/EvaluationRepository");

const AttemptService =
    require("../services/AttemptService");

const EvaluationService =
    require("../services/EvaluationService");

const AttemptController =
    require("../controllers/AttemptController");

const EvaluationController =
    require("../controllers/EvaluationController");

const RuleBasedEvaluator =
    require("../evaluators/RuleBasedEvaluator");

const router = express.Router();


// Repositories
const attemptRepository =
    new AttemptRepository();

const problemRepository =
    new ProblemRepository();

const evaluationRepository =
    new EvaluationRepository();


// Evaluator
const evaluator =
    new RuleBasedEvaluator();


// Evaluation Service
const evaluationService =
    new EvaluationService(
        attemptRepository,
        problemRepository,
        evaluationRepository,
        evaluator
    );


// Attempt Service
const attemptService =
    new AttemptService(
        attemptRepository,
        problemRepository,
        evaluationService
    );


// Controllers
const attemptController =
    new AttemptController(
        attemptService
    );

const evaluationController =
    new EvaluationController(
        evaluationRepository,
        attemptRepository
    );


// Routes

router.post(
    "/",
    attemptController.createAttempt
);

router.get(
    "/",
    attemptController.getAttempts
);

router.get(
    "/:id",
    attemptController.getAttemptById
);

router.put(
    "/:id/submission",
    attemptController.saveSubmission
);

router.post(
    "/:id/submit",
    attemptController.submitAttempt
);

router.get(
    "/:id/evaluation",
    evaluationController.getEvaluation
);


module.exports = router;