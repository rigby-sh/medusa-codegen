import { AbstractImporter, ImporterOptions, RunContext } from '../abstract-importer';
import { Ollama } from 'ollama'

class ProductImporter extends AbstractImporter {
    // Add your class methods here
    async run(options: RunContext) {
        // Add your code here
        console.log('products importer')
        const ollama = new Ollama({ host: 'http://ollama:11434' })

        const message = { role: 'user', content: 'Why is the sky blue?' }
        const response = await ollama.chat({ model: 'llama3', messages: [message], stream: true })
        for await (const part of response) {
          process.stdout.write(part.message.content)
        }
    }
}

export { ProductImporter }