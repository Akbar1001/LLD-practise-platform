const express = require("express");

const ProblemRepository = require("../repositories/ProblemRepository");
const ProblemService = require("../services/ProblemService");
const ProblemController = require("../controllers/ProblemController");

const router = express.Router();

const problemRepository = new ProblemRepository();
const problemService = new ProblemService(problemRepository);
const problemController = new ProblemController(problemService);

router.get("/", problemController.getProblems);

router.get("/:id", problemController.getProblemById);

module.exports = router;