const Evaluator = require("../domain/Evaluator");
const {
    Evaluation,
    EvaluationCriterion
} = require("../domain/Evaluation");

class RuleBasedEvaluator extends Evaluator {
    evaluate(attempt, problem) {
        const submission = attempt.submission;

        const criteria = [];

        criteria.push(
            new EvaluationCriterion({
                key: "completeness",
                name: "Submission Completeness",
                score: submission.isComplete() ? 10 : 0,
                maxScore: 10,
                evidence: submission.isComplete()
                    ? "All required design sections are present."
                    : "One or more required sections are missing.",
                concern: submission.isComplete()
                    ? null
                    : "The evaluator does not have enough information.",
                suggestion: submission.isComplete()
                    ? null
                    : "Complete all sections before submitting.",
                confidence: 1
            })
        );

        return new Evaluation({
            attemptId: attempt.id,
            criteria
        });
    }
}

module.exports = RuleBasedEvaluator;