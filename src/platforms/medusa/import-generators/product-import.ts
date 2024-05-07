import { AbstractGenerator, GeneratorOptions, RunContext } from '../../../types/abstract-generator';
import { Ollama } from "@langchain/community/llms/ollama";
import fs from 'fs';
import medusaProductFields from '../specs/products/medusa-product-fields.json';
import { findCodeBlocks } from '../../../helpers';

class MedusaProductImportGenerator extends AbstractGenerator {
    async run(context: RunContext) {
      // Add your code here
      console.log('Generating Medusa products importer '+process.cwd());
      const importerTemplate = fs.readFileSync(process.cwd() + '/src/platforms/medusa/templates/importer.ts', 'utf-8');
      const inputSourcePrompt: String = context['inputSource'];
      const modelName = process.env.OLLAMA_MODEL || 'llama3';
      const fieldsToImport = medusaProductFields.filter((field) => (context.fields as string[]).includes(field.field_name));
      const productsCreateSpec =  fs.readFileSync(process.cwd() + '/src/platforms/medusa/specs/products/products.create.mdx', 'utf-8');

      const ollama = new Ollama({ 
        baseUrl: 'http://' + process.env.OLLAMA_HOST + ':' + process.env.OLLAMA_PORT,
        model: modelName
       });

      // TODO: we'll probably need to add a full RAG support with vector store given support for all diferent input sources and how to use them
      const fullPrompt =         
        `\
        Here is a data import program template in TypeScript: \
        >>> \
        ${importerTemplate} \
        <<< \

        Here are the selected input fields: ${JSON.stringify(fieldsToImport)} \
        Required medusajs/client API methods: ${productsCreateSpec}

        Generate a fully functional data importer. Here is the instruction how the data input should be read: ${inputSourcePrompt} \
        Output it should be written to the Medusa using the '@medusajs/client' and the admin API URL is:  \
        ${context.medusaUrl} \
        Medusa API user name is: ${context.medusaUsername} \
        Medusa API password is: ${context.medusaPassword} \
        Use only standard Node modules like fs, http and others. Do not use any undefined functions. You can use only the following external modules: @medusajs/client\
        Before the data import transform the records following this instruction: ${context.dataTransform} \
        `;
      console.log('Executing code generator. Please wait ...')
      // console.log(fullPrompt);
  
      const stream = await ollama.stream(fullPrompt)

      const chunks = [];
      for await (const chunk of stream) {
        process.stdout.write(chunk);
        chunks.push(chunk);
      }

      const codeBlocks = findCodeBlocks(chunks.join(''));
      console.log(codeBlocks);
      // TODO: write file to `generators` directory
    }
}

export { MedusaProductImportGenerator }