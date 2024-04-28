import { AbstractGenerator, GeneratorOptions, RunContext } from '../../../types/abstract-generator';
import { Ollama } from 'ollama'
import fs from 'fs';
import { dirname } from 'path';

class MedusaProductImportGenerator extends AbstractGenerator {
    async run(context: RunContext, options?: GeneratorOptions) {
      // Add your code here
      console.log('Generating Medusa products importer '+process.cwd());
      const importerTemplate = fs.readFileSync(process.cwd() + '/src/platforms/medusa/templates/importer.ts', 'utf-8');
      const userPrompt: String = context['userPrompt'];

      const ollama = new Ollama({ host: 'http://ollama:11434' });

      const message = { role: 'user', content: `\
        You are a code generator. Return just a type script code and nothing more. Please modify the following file (between >>> and <<<): \
        >>> \
        ${importerTemplate} \
        <<< \

        Fill just the "processSingleRecord" and "run" functions. \

        Here is how the data input should be processed: ${userPrompt} \
        Regarding the data output - it should be written to the MedusaJS REST API. \
        Medusa instance is available at ${context.medusaUrl}
      `};

      console.log(message);

      const response = await ollama.chat({ model: 'llama3', messages: [message], stream: true });
      for await (const part of response) {
        process.stdout.write(part.message.content);
      }
      // TODO: write file to `generators` directory
    }
}

export { MedusaProductImportGenerator }