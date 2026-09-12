class EvaluationCriterion {
    constructor({
        key,
        name,
        score,
        maxScore,
        evidence,
        concern,
        suggestion,
        confidence
    }) {
        this.key = key;
        this.name = name;
        this.score = score;
        this.maxScore = maxScore;
        this.evidence = evidence;
        this.concern = concern;
        this.suggestion = suggestion;
        this.confidence = confidence;
    }
}

class Evaluation {
    constructor({
        attemptId,
        criteria = [],
        strengths = [],
        improvements = []
    }) {
        this.attemptId = attemptId;
        this.criteria = criteria;
        this.strengths = strengths;
        this.improvements = improvements;
    }

    calculateScore() {
        const total = this.criteria.reduce(
            (sum, criterion) => sum + criterion.score,
            0
        );

        const maximum = this.criteria.reduce(
            (sum, criterion) => sum + criterion.maxScore,
            0
        );

        if (maximum === 0) {
            return 0;
        }

        return Math.round((total / maximum) * 100);
    }
}

module.exports = {
    Evaluation,
    EvaluationCriterion
};