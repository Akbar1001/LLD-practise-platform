const Evaluator = require("../domain/Evaluator");

const {
    Evaluation,
    EvaluationCriterion
} = require("../domain/Evaluation");

class RuleBasedEvaluator extends Evaluator {
    evaluate(attempt, problem) {
        const submission = attempt.submission;

        const criteria = [
            this.evaluateRequirementUnderstanding(
                submission,
                problem
            ),

            this.evaluateResponsibilities(
                submission
            ),

            this.evaluateRelationships(
                submission
            ),

            this.evaluateDesignDecisions(
                submission
            ),

            this.evaluateEdgeCases(
                submission
            )
        ];

        return new Evaluation({
            attemptId: attempt.id,
            criteria,
            strengths: this.getStrengths(criteria),
            improvements: this.getImprovements(criteria)
        });
    }


    // -----------------------------------------
    // Requirement Understanding
    // -----------------------------------------

    evaluateRequirementUnderstanding(
        submission,
        problem
    ) {
        const combinedText = [
            submission.classesAndResponsibilities,
            submission.relationships,
            submission.designDecisions,
            submission.edgeCases
        ].join(" ");

        const wordCount =
            this.getWordCount(combinedText);

        const problemTerms =
            this.getProblemTerms(problem);

        const matchedProblemTerms =
            problemTerms.filter(term =>
                combinedText.toLowerCase().includes(
                    term.toLowerCase()
                )
            );

        let score = 0;

        if (wordCount >= 20) {
            score += 5;
        }

        if (wordCount >= 50) {
            score += 5;
        }

        if (wordCount >= 100) {
            score += 5;
        }

        if (matchedProblemTerms.length > 0) {
            score += 3;
        }

        if (matchedProblemTerms.length >= 2) {
            score += 2;
        }

        score = Math.min(score, 20);

        return new EvaluationCriterion({
            key: "requirement_understanding",
            name: "Requirement Understanding",
            score,
            maxScore: 20,

            evidence:
                score >= 15
                    ? `The submission contains ${wordCount} words and references ${matchedProblemTerms.length} problem-specific concept(s).`
                    : `The submission contains ${wordCount} words and references ${matchedProblemTerms.length} problem-specific concept(s).`,

            concern:
                score < 10
                    ? "The solution contains limited evidence that the problem requirements were understood."
                    : score < 15
                        ? "The solution addresses the problem at a basic level, but some requirements may not be covered."
                        : null,

            suggestion:
                score < 15
                    ? "Connect your design explicitly to the requirements and important concepts in the problem statement."
                    : null,

            confidence: 0.85
        });
    }


    // -----------------------------------------
    // Class Responsibilities
    // -----------------------------------------

    evaluateResponsibilities(submission) {
        const text =
            submission.classesAndResponsibilities.trim();

        const wordCount =
            this.getWordCount(text);

        const classNames =
            this.extractClassNames(text);

        const responsibilityIndicators = [
            "responsible",
            "responsibility",
            "manages",
            "manage",
            "handles",
            "handle",
            "represents",
            "contains",
            "owns",
            "provides",
            "controls",
            "maintains",
            "creates",
            "updates",
            "validates"
        ];

        const responsibilityCount =
            responsibilityIndicators.filter(
                word =>
                    text.toLowerCase().includes(word)
            ).length;

        let score = 0;

        if (wordCount >= 15) {
            score += 4;
        }

        if (classNames.length >= 1) {
            score += 4;
        }

        if (classNames.length >= 3) {
            score += 4;
        }

        if (responsibilityCount >= 1) {
            score += 4;
        }

        if (responsibilityCount >= 3) {
            score += 4;
        }

        score = Math.min(score, 20);

        return new EvaluationCriterion({
            key: "responsibilities",
            name: "Class Responsibilities",
            score,
            maxScore: 20,

            evidence:
                classNames.length > 0
                    ? `Identified approximately ${classNames.length} class/entity candidate(s) and ${responsibilityCount} responsibility indicator(s).`
                    : "No clear class or entity candidates were identified.",

            concern:
                score < 10
                    ? "The submission does not clearly define classes and their responsibilities."
                    : score < 15
                        ? "Some classes or responsibilities are described, but the separation of responsibilities could be clearer."
                        : null,

            suggestion:
                score < 15
                    ? "Name the main classes explicitly and describe one or two concrete responsibilities for each."
                    : null,

            confidence: 0.8
        });
    }


    // -----------------------------------------
    // Relationships
    // -----------------------------------------

    evaluateRelationships(submission) {
        const text =
            submission.relationships.trim();

        const wordCount =
            this.getWordCount(text);

        const relationshipPatterns = [
            /\bcontains\b/i,
            /\bhas\b/i,
            /\buses\b/i,
            /\bdepends on\b/i,
            /\bdepends\b/i,
            /\bextends\b/i,
            /\bimplements\b/i,
            /\binherits\b/i,
            /\bcomposes\b/i,
            /\bassociated with\b/i,
            /\bcalls\b/i,
            /\bdelegates\b/i,
            /\bowns\b/i,
            /\bcreates\b/i
        ];

        const relationshipCount =
            relationshipPatterns.filter(
                pattern => pattern.test(text)
            ).length;

        const classReferences =
            this.extractClassNames(text);

        let score = 0;

        if (wordCount >= 10) {
            score += 4;
        }

        if (relationshipCount >= 1) {
            score += 5;
        }

        if (relationshipCount >= 2) {
            score += 3;
        }

        if (classReferences.length >= 2) {
            score += 3;
        }

        score = Math.min(score, 15);

        return new EvaluationCriterion({
            key: "relationships",
            name: "Relationships & Coupling",
            score,
            maxScore: 15,

            evidence:
                relationshipCount > 0
                    ? `Detected ${relationshipCount} relationship/dependency indicator(s) in the relationship description.`
                    : "No clear relationship or dependency indicators were detected.",

            concern:
                score < 8
                    ? "The collaboration between classes is not clearly described."
                    : score < 12
                        ? "Some relationships are present, but ownership and dependencies could be clearer."
                        : null,

            suggestion:
                score < 12
                    ? "Explain which classes contain, use, create, or depend on other classes."
                    : null,

            confidence: 0.8
        });
    }


    // -----------------------------------------
    // Design Decisions
    // -----------------------------------------

    evaluateDesignDecisions(submission) {
        const text =
            submission.designDecisions.trim();

        const wordCount =
            this.getWordCount(text);

        const concepts = [
            {
                name: "abstraction",
                patterns: [
                    "interface",
                    "abstraction",
                    "abstract"
                ]
            },

            {
                name: "encapsulation",
                patterns: [
                    "encapsulation",
                    "private",
                    "hide",
                    "hidden"
                ]
            },

            {
                name: "polymorphism",
                patterns: [
                    "polymorphism",
                    "strategy",
                    "subclass",
                    "inheritance"
                ]
            },

            {
                name: "SOLID",
                patterns: [
                    "solid",
                    "single responsibility",
                    "open closed",
                    "dependency inversion"
                ]
            },

            {
                name: "extensibility",
                patterns: [
                    "extensible",
                    "extensibility",
                    "future",
                    "new type",
                    "new vehicle",
                    "new requirement",
                    "extend"
                ]
            }
        ];

        const detectedConcepts =
            concepts.filter(concept =>
                concept.patterns.some(pattern =>
                    text.toLowerCase().includes(pattern)
                )
            );

        let score = 0;

        if (wordCount >= 15) {
            score += 3;
        }

        if (wordCount >= 40) {
            score += 2;
        }

        score += detectedConcepts.length * 2;

        if (
            /\b(because|so that|allows|helps|chosen|choose|reason)\b/i
                .test(text)
        ) {
            score += 4;
        }

        score = Math.min(score, 15);

        return new EvaluationCriterion({
            key: "design_decisions",
            name: "Design Decisions & Extensibility",
            score,
            maxScore: 15,

            evidence:
                detectedConcepts.length > 0
                    ? `The submission discusses ${detectedConcepts.length} design concept(s): ${detectedConcepts.map(c => c.name).join(", ")}.`
                    : "No recognizable design principles or rationale were detected.",

            concern:
                score < 8
                    ? "The design rationale is limited."
                    : score < 12
                        ? "Some design decisions are mentioned, but the reasoning behind them could be stronger."
                        : null,

            suggestion:
                score < 12
                    ? "Explain why you chose the design and how it would handle a new requirement."
                    : null,

            confidence: 0.75
        });
    }


    // -----------------------------------------
    // Edge Cases
    // -----------------------------------------

    evaluateEdgeCases(submission) {
        const text =
            submission.edgeCases.trim();

        const wordCount =
            this.getWordCount(text);

        const edgeCasePatterns = [
            "full",
            "empty",
            "invalid",
            "duplicate",
            "not found",
            "unavailable",
            "failure",
            "error",
            "timeout",
            "null",
            "zero",
            "negative",
            "maximum",
            "minimum",
            "already",
            "does not exist",
            "network",
            "concurrent",
            "concurrency"
        ];

        const detectedCases =
            edgeCasePatterns.filter(pattern =>
                text.toLowerCase().includes(pattern)
            );

        let score = 0;

        if (wordCount >= 5) {
            score += 2;
        }

        if (detectedCases.length >= 1) {
            score += 2;
        }

        if (detectedCases.length >= 3) {
            score += 3;
        }

        if (detectedCases.length >= 5) {
            score += 3;
        }

        score = Math.min(score, 10);

        return new EvaluationCriterion({
            key: "edge_cases",
            name: "Edge Cases & Robustness",
            score,
            maxScore: 10,

            evidence:
                detectedCases.length > 0
                    ? `Detected ${detectedCases.length} potential edge-case category(s): ${detectedCases.join(", ")}.`
                    : "No common edge-case categories were detected.",

            concern:
                score < 5
                    ? "Few concrete failure or boundary scenarios were identified."
                    : score < 8
                        ? "Some edge cases are covered, but additional failure scenarios may be missing."
                        : null,

            suggestion:
                score < 8
                    ? "Consider invalid input, unavailable resources, duplicate operations, empty/full states, and failure scenarios."
                    : null,

            confidence: 0.8
        });
    }


    // -----------------------------------------
    // Helpers
    // -----------------------------------------

    getWordCount(text) {
        if (!text || !text.trim()) {
            return 0;
        }

        return text
            .trim()
            .split(/\s+/)
            .length;
    }


    extractClassNames(text) {
        if (!text) {
            return [];
        }

        const matches = text.match(
            /\b[A-Z][A-Za-z0-9]*(?:Manager|Service|Controller|Repository|Factory|Strategy|Lot|Spot|Vehicle|Machine|Elevator|Floor|Product|User|Payment|Ticket|Item)\b/g
        );

        return [...new Set(matches || [])];
    }


    getProblemTerms(problem) {
        if (!problem) {
            return [];
        }

        const terms = [];

        if (problem.title) {
            terms.push(
                ...problem.title
                    .split(/\s+/)
                    .filter(word => word.length >= 4)
            );
        }

        if (problem.requirements) {
            for (const requirement of problem.requirements) {
                terms.push(
                    ...requirement
                        .split(/\s+/)
                        .filter(word => word.length >= 5)
                );
            }
        }

        return [
            ...new Set(
                terms.map(term =>
                    term
                        .replace(/[^a-zA-Z]/g, "")
                        .toLowerCase()
                )
            )
        ];
    }


    getStrengths(criteria) {
        return criteria
            .filter(
                criterion =>
                    criterion.score >=
                    criterion.maxScore * 0.7
            )
            .map(
                criterion =>
                    criterion.name
            );
    }


    getImprovements(criteria) {
        return criteria
            .filter(
                criterion =>
                    criterion.score <
                    criterion.maxScore * 0.7
            )
            .map(
                criterion =>
                    criterion.suggestion ||
                    `Improve ${criterion.name}.`
            );
    }
}

module.exports = RuleBasedEvaluator;