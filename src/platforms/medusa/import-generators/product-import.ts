import { AbstractGenerator, GeneratorOptions, RunContext } from '../../../types/abstract-generator';
import { Ollama } from "@langchain/community/llms/ollama";
import fs from 'fs';
import medusaProductFields from '../specs/products/medusa-product-fields.json';
import { findCodeBlocks } from '../../../helpers';

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";


async function importersVectorStore() {
  const loader = new DirectoryLoader(
    process.cwd() + "/src/importers",
    {
      ".ts": (path: string) => new TextLoader(path),
    }
  );
  const docs = await loader.load();
  // Load the docs into the vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings()
  );

  return vectorStore
}



class MedusaProductImportGenerator extends AbstractGenerator {
    async run(context: RunContext) {
      // Add your code here
      console.log('Generating Medusa products importer '+process.cwd());
      const importerTemplate = fs.readFileSync(process.cwd() + '/src/platforms/medusa/templates/importer.ts', 'utf-8');
      let importerSourceTemplate = fs.readFileSync(process.cwd() + '/src/import-sources/import-csv.ts', 'utf-8'); // the default one
      
      const inputSourcePrompt: string = context['inputSource'];
      const modelName = process.env.OLLAMA_MODEL || 'llama3';
      const fieldsToImport = medusaProductFields.filter((field: any) => (context.fields as string[]).includes(field.field_name));

      const d = new Date()
      const datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes();
      const outputFileName = process.cwd() + '/generated/product.ts';
      const outputFileNameSnapshot = process.cwd() + '/generated/product-' + datestring + '.ts';

      const vectorStore = await importersVectorStore();
      const resultOne = await vectorStore.similaritySearch(inputSourcePrompt, 1);

      if (resultOne){
        importerSourceTemplate = resultOne[0].pageContent;
        console.log('Found input source template: ' + importerSourceTemplate);
      }

      const ollama = new Ollama({ 
        baseUrl: 'http://' + process.env.OLLAMA_HOST + ':' + process.env.OLLAMA_PORT,
        model: modelName
       });

      // TODO: we'll probably need to add a full RAG support with vector store given support for all diferent input sources and how to use them
      // TODO: make it just filling the template not having to know the MedusaJS API - provide an example witihn the template so it just needs to use the fields spec
      const fullPrompt =         
        `\
        Generate the code for TypeScript program which Imports the data: ${inputSourcePrompt}\

        by merging this importer code:

        >>> \
        ${importerSourceTemplate} \
        <<< \

        with this template:

        >>> \
        ${importerTemplate} \
        <<< \

       In "runImport" tunction: 
       1. Open data source with "processInput" function. 
       2. Modify the "processSingleRecord" function:
       2.1 Parse the source file and extract the relevant fields using "parseSingleRecord" function. \
       2.2 Use function "importSingleProduct" to process every record read by "parseSingleRecord" function. \
       2.3 Within "transformSopurceDataToMedusa" generate code to apply this data transform logic: ${context.dataTransform} \
       2.4 Then, modify function "transformSourceDataToMedusa" to return data in MedusaJS format:
       from input fields: ${context.inputFields}\n
       map to output fields: \n
       ${JSON.stringify(fieldsToImport)} \
       Only these outpupt fields should be returned. \
       Set the constant "MEDUSA_BACKEND_URL" to ${context.medusaUrl} \
       Set the constant "MEUDUSA_USERNAME" to ${context.medusaUserName} \
       Set the constant "MEUDUSA_PASSWORD" to: ${context.medusaPassword} \
       Use only standard Node modules like fs, http and others. Do not use any undefined functions.
       \n
       Return the full source code of entire program including all imports, constains and functions. \
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
      if(codeBlocks.blocks.length === 0) {
        console.error('No code blocks found in the output');
        return;
      } else {
        const generatedCode = codeBlocks.blocks.map(b => b.code).join('\n');
        console.info('Writing code to file: ' + outputFileNameSnapshot + ' and ' + outputFileName);
        fs.writeFileSync(outputFileNameSnapshot, generatedCode);
        fs.writeFileSync(outputFileName, generatedCode);
      }
      
      // TODO: write file to `generators` directory
    }
}

export { MedusaProductImportGenerator }