class Submission {
    constructor({
        classesAndResponsibilities,
        relationships,
        designDecisions,
        edgeCases
    }) {
        this.classesAndResponsibilities = classesAndResponsibilities;
        this.relationships = relationships;
        this.designDecisions = designDecisions;
        this.edgeCases = edgeCases;
    }

    isComplete() {
        return Boolean(
            this.classesAndResponsibilities?.trim() &&
            this.relationships?.trim() &&
            this.designDecisions?.trim() &&
            this.edgeCases?.trim()
        );
    }
}

module.exports = Submission;