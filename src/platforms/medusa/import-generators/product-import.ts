import { AbstractGenerator, GeneratorOptions, RunContext } from '../../../types/abstract-generator';
import { Ollama } from 'ollama'

class MedusaProductImportGenerator extends AbstractGenerator {
    // Add your class methods here
    async run(context: RunContext, options?: GeneratorOptions) {
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

export { MedusaProductImportGenerator }