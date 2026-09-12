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
            this.evaluateCompleteness(submission)
        );

        criteria.push(
            this.evaluateResponsibilities(submission)
        );

        criteria.push(
            this.evaluateRelationships(submission)
        );

        criteria.push(
            this.evaluateDesignDecisions(submission)
        );

        criteria.push(
            this.evaluateEdgeCases(submission)
        );

        return new Evaluation({
            attemptId: attempt.id,
            criteria,
            strengths: this.getStrengths(criteria),
            improvements: this.getImprovements(criteria)
        });
    }

    evaluateCompleteness(submission) {
        const complete = submission.isComplete();

        return new EvaluationCriterion({
            key: "completeness",
            name: "Requirement Understanding",
            score: complete ? 20 : 5,
            maxScore: 20,
            evidence: complete
                ? "All four required design sections are present."
                : "One or more required design sections are missing.",
            concern: complete
                ? null
                : "The solution cannot be evaluated reliably without all sections.",
            suggestion: complete
                ? null
                : "Complete Classes & Responsibilities, Relationships, Design Decisions, and Edge Cases.",
            confidence: 1
        });
    }

    evaluateResponsibilities(submission) {
        const text = submission.classesAndResponsibilities.trim();

        const hasClassConcept =
            /\b(class|classes|entity|entities|manager|service|repository|interface)\b/i.test(
                text
            );

        const hasResponsibilityConcept =
            /\b(manage|handles|responsible|responsibility|represents|contains)\b/i.test(
                text
            );

        let score = 5;

        if (hasClassConcept) {
            score += 7;
        }

        if (hasResponsibilityConcept) {
            score += 8;
        }

        return new EvaluationCriterion({
            key: "responsibilities",
            name: "Class Responsibilities",
            score,
            maxScore: 20,
            evidence: hasResponsibilityConcept
                ? "The submission describes classes/entities together with their responsibilities."
                : "Classes are mentioned, but their responsibilities are not clearly explained.",
            concern: score < 15
                ? "Responsibilities may be too vague or concentrated in a small number of classes."
                : null,
            suggestion: score < 15
                ? "For each important class, explicitly state what it owns and what behavior it is responsible for."
                : null,
            confidence: 0.8
        });
    }

    evaluateRelationships(submission) {
        const text = submission.relationships.trim();

        const relationshipPattern =
            /\b(contains|has|uses|depends|extends|implements|inherits|composes|associated|one-to-many|many-to-many|inherits from)\b/i;

        const hasRelationship =
            relationshipPattern.test(text);

        return new EvaluationCriterion({
            key: "relationships",
            name: "Relationships & Coupling",
            score: hasRelationship ? 15 : 5,
            maxScore: 15,
            evidence: hasRelationship
                ? "The submission describes relationships between design elements."
                : "No clear class relationship or dependency is described.",
            concern: hasRelationship
                ? null
                : "The design cannot be assessed for coupling and collaboration.",
            suggestion: hasRelationship
                ? null
                : "Explain how the main classes collaborate and identify ownership or dependency relationships.",
            confidence: 0.85
        });
    }

    evaluateDesignDecisions(submission) {
        const text = submission.designDecisions.trim();

        const patterns = [
            /\b(interface|abstraction)\b/i,
            /\b(strategy|polymorphism)\b/i,
            /\b(encapsulation|private|hide)\b/i,
            /\b(solid|single responsibility|open\/closed)\b/i,
            /\b(extensib|flexib|future)\b/i
        ];

        const decisionCount = patterns.filter(
            pattern => pattern.test(text)
        ).length;

        const score = Math.min(
            15,
            5 + decisionCount * 2
        );

        return new EvaluationCriterion({
            key: "design_decisions",
            name: "Design Decisions & Extensibility",
            score,
            maxScore: 15,
            evidence: decisionCount > 0
                ? `The submission identifies ${decisionCount} relevant design consideration(s).`
                : "The submission does not explain why the proposed design was chosen.",
            concern: decisionCount < 2
                ? "The design rationale is limited."
                : null,
            suggestion: decisionCount < 2
                ? "Explain why your design is appropriate and how it could accommodate a new requirement."
                : null,
            confidence: 0.7
        });
    }

    evaluateEdgeCases(submission) {
        const text = submission.edgeCases.trim();

        const separators = text
            .split(/[,;\n]|(?:\band\b)/i)
            .map(item => item.trim())
            .filter(Boolean);

        const count = separators.length;

        const score = Math.min(
            10,
            Math.max(2, count * 2)
        );

        return new EvaluationCriterion({
            key: "edge_cases",
            name: "Edge Cases & Robustness",
            score,
            maxScore: 10,
            evidence: count > 0
                ? `The submission identifies approximately ${count} edge case(s).`
                : "No specific edge cases were identified.",
            concern: count < 3
                ? "Important failure or boundary scenarios may be missing."
                : null,
            suggestion: count < 3
                ? "Consider invalid input, unavailable resources, duplicate operations, empty/full states, and failure scenarios relevant to the problem."
                : null,
            confidence: 0.75
        });
    }

    getStrengths(criteria) {
        return criteria
            .filter(criterion => criterion.score >= criterion.maxScore * 0.75)
            .map(criterion => criterion.name);
    }

    getImprovements(criteria) {
        return criteria
            .filter(criterion => criterion.score < criterion.maxScore * 0.75)
            .map(criterion => {
                return criterion.suggestion || `Improve ${criterion.name}.`;
            });
    }
}

module.exports = RuleBasedEvaluator;