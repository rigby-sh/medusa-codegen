import { AbstractGenerator, GeneratorOptions, RunContext } from '../../../types/abstract-generator';
import { Ollama } from "@langchain/community/llms/ollama";
import fs from 'fs';
import medusaProductFields from '../specs/products-import.json';

class MedusaProductImportGenerator extends AbstractGenerator {
    async run(context: RunContext) {
      // Add your code here
      console.log('Generating Medusa products importer '+process.cwd());
      const importerTemplate = fs.readFileSync(process.cwd() + '/src/platforms/medusa/templates/importer.ts', 'utf-8');
      const inputSourcePrompt: String = context['inputSource'];
      const modelName = process.env.OLLAMA_MODEL || 'llama3';
      console.log(context['fields']);
      const fieldsToImport = medusaProductFields.filter((field) => (context.fields as string[]).includes(field.field_name));

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

        Here are the selected input fields: ${JSON.stringify(fieldsToImport)} \

        Generate a fully functional data importer. Here is the instruction how the data input should be read: ${inputSourcePrompt} \
        Output it should be written to the Medusa using the '@medusajs/client' and the admin API URL is:  \
       ${context.medusaUrl} \
        Use only standard Node modules like fs, http and others. You can use only the following external modules: @medusajs/client\
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