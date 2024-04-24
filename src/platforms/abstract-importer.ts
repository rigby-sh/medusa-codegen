interface ImporterOptions {
    medusaUrl: string;
    credentials: string;
    // Add any other options you need
}

class AbstractImporter {
    protected options: ImporterOptions
    constructor(options: ImporterOptions) {
        this.options = options
    }
    // Define the properties and methods of the AbstractImporter interface
    async run(options: RunContext): Promise<void> {
        // Add implementation here
    }
}

type RunContext = any

export { AbstractImporter, ImporterOptions, RunContext };
