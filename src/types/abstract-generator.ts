interface GeneratorOptions {
    // Add any other options you need
}

class AbstractGenerator {
    protected options: GeneratorOptions
    constructor(options: GeneratorOptions) {
        this.options = options
    }
    // Define the properties and methods of the AbstractImporter interface
    async run(context: RunContext): Promise<void> {
        // Add implementation here
    }
}

type RunContext = any

export { AbstractGenerator, GeneratorOptions, RunContext };
