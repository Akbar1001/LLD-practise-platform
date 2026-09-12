const express = require("express");

const AttemptRepository = require("../repositories/AttemptRepository");
const ProblemRepository = require("../repositories/ProblemRepository");
const EvaluationRepository = require("../repositories/EvaluationRepository");

const AttemptService = require("../services/AttemptService");
const EvaluationService = require("../services/EvaluationService");

const AttemptController = require("../controllers/AttemptController");

const RuleBasedEvaluator =require("../evaluators/RuleBasedEvaluator");

const EvaluationController =require("../controllers/EvaluationController");


const router = express.Router();



const attemptRepository = new AttemptRepository();
const problemRepository = new ProblemRepository();
const evaluationRepository = new EvaluationRepository();

const evaluator = new RuleBasedEvaluator();

const evaluationService = new EvaluationService(
    attemptRepository,
    problemRepository,
    evaluationRepository,
    evaluator
);

const attemptService = new AttemptService(
    attemptRepository,
    problemRepository,
    evaluationService
);

const attemptController =
    new AttemptController(attemptService);

const evaluationController =
    new EvaluationController(evaluationRepository);

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

router.get(
    "/:id/evaluation",
    evaluationController.getEvaluation
);


module.exports = router;