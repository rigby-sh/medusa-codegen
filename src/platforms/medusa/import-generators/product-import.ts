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
      const importerSourceTemplate = fs.readFileSync(process.cwd() + '/src/importers/import-csv.ts', 'utf-8');
      
      const inputSourcePrompt: String = context['inputSource'];
      const modelName = process.env.OLLAMA_MODEL || 'llama3';
      const fieldsToImport = medusaProductFields.filter((field) => (context.fields as string[]).includes(field.field_name));
      

      const ollama = new Ollama({ 
        baseUrl: 'http://' + process.env.OLLAMA_HOST + ':' + process.env.OLLAMA_PORT,
        model: modelName
       });

      // TODO: we'll probably need to add a full RAG support with vector store given support for all diferent input sources and how to use them
      // TODO: make it just filling the template not having to know the MedusaJS API - provide an example witihn the template so it just needs to use the fields spec
      const fullPrompt =         
        `\
        Modify the import program: \
        >>> \
        ${importerTemplate} \
        <<< \

       You're importing products to Medusa.
       Modify "runImport" function to read the data from the source: ${inputSourcePrompt}.
       Use "processInput" and "parseSingleRecord" functions from the example below to read it. Merge import definitions from template above and code below.

       >>> \
       ${importerSourceTemplate} \
       <<< \

       Use function "importSingleProduct" to process all records in the source.
       Within "transformSopurceDataToMedusa" generate code to apply this data transform logic: ${context.dataTransform} \
       Then, modify function "transformSourceDataToMedusa" to return data in MedusaJS format:
       ${JSON.stringify(fieldsToImport)} \
       You can not use fields out of this specification.
       Set the constant "MEDUSA_BACKEND_URL" to ${context.medusaUrl} \
       Set the constant "MEUDUSA_USERNAME" to ${context.medusaUserName} \
       Set the constant "MEUDUSA_PASSWORD" to: ${context.medusaPassword} \
       Use only standard Node modules like fs, http and others. Do not use any undefined functions.
       `;
      console.log('Executing code generator. Please wait ...')
      console.log(fullPrompt);
  
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