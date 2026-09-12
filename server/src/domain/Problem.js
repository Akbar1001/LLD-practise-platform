class Problem {
    constructor({
        id,
        title,
        slug,
        difficulty,
        description,
        requirements = [],
        constraints = [],
        active = true
    }) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.difficulty = difficulty;
        this.description = description;
        this.requirements = requirements;
        this.constraints = constraints;
        this.active = active;
    }

    isAvailable() {
        return this.active;
    }
}

module.exports = Problem;