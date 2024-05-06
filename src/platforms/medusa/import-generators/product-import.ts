import { AbstractGenerator, GeneratorOptions, RunContext } from '../../../types/abstract-generator';
import { Ollama } from "@langchain/community/llms/ollama";
import fs from 'fs';

class MedusaProductImportGenerator extends AbstractGenerator {
    async run(context: RunContext, options?: GeneratorOptions) {
      // Add your code here
      console.log('Generating Medusa products importer '+process.cwd());
      const importerTemplate = fs.readFileSync(process.cwd() + '/src/platforms/medusa/templates/importer.ts', 'utf-8');
      const endpointSpec = fs.readFileSync(process.cwd() + '/src/platforms/medusa/specs/products-import.txt', 'utf-8');
      const userPrompt: String = context['userPrompt'];
      const modelName = process.env.OLLAMA_MODEL || 'llama3'

      const ollama = new Ollama({ 
        baseUrl: 'http://' + process.env.OLLAMA_HOST + ':' + process.env.OLLAMA_PORT,
        model: modelName
       });

      const fullPrompt =         
        `\
        Here is a data import program template in TypeScript: \
        >>> \
        ${importerTemplate} \
        <<< \

        Generate a fully functional data importer. Here is the instruction how the data input should be read: ${userPrompt} \
        Output it should be written to the Medusa using the '@medusajs/client' and the admin API URL is:  \

        ${endpointSpec}

        Medusa instance is available at ${context.medusaUrl} \
        Use only standard Node modules like fs, http and others. You can use only the following external modules: @medusajs/client\
        Please end up response with full TypeScript code inside <code></code> tag.
        `;
      console.log('Executing code generator with the following request: ')
      console.log(fullPrompt);
  
      const stream = await ollama.stream(fullPrompt);

      const chunks = [];
      for await (const chunk of stream) {
        process.stdout.write(chunk);
      }      
      // TODO: write file to `generators` directory
    }
}

export { MedusaProductImportGenerator }