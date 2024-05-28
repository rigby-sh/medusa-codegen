// Import necessary modules and types
// import { User } from './types/index';
import select from '@inquirer/select';
import chalk from 'chalk';
import { generatorFactory, dataFlowParameters, parameterOptions } from './platforms/medusa';
import { DataFlowDirection } from './types';
import { AbstractGenerator } from './types/abstract-generator';
import { checkbox, input } from '@inquirer/prompts';



async function promptUser() {
  console.log(chalk.green('Welcome to Medusa ') + chalk.bgCyan('Codegen'));

  const selectedOptions: { [key: string]: any } = {
  }

  for (const key of dataFlowParameters) {
    const setupOption = parameterOptions(key, selectedOptions); // prompt user for the required data flown
    if(setupOption.type === 'select' ) {
      selectedOptions[key] = await select(setupOption);
    } else if(setupOption.type === 'input') {
      selectedOptions[key] = await input(setupOption);
    } else if(setupOption.type === 'checkbox' ) {
      selectedOptions[key] = await checkbox(setupOption);
    }
  }
  return selectedOptions
}


async function run(selectedOptions: { [key: string]: any }) {
  console.log(selectedOptions);

// productImportGenerator usage
  const generator:AbstractGenerator = generatorFactory({
    type: selectedOptions['dataFlowType'],
    direction: selectedOptions['dataFlowDirection'] as DataFlowDirection
  });
  await generator.run({
    ...selectedOptions,
    medusaUrl: process.env.MEDUSA_BACKEND_URL
  }) as any;
}


async function readJSONfromSTDIN(): Promise<{ [key: string]: any }> {
  let stdin = process.stdin
  let inputChunks:string[] = []

  stdin.resume()
  stdin.setEncoding('utf8')

  stdin.on('data', function (chunk) {
    inputChunks.push(chunk.toString());
  });

  return new Promise((resolve, reject) => {
    stdin.on('end', function () {
      let inputJSON = inputChunks.join('')
      resolve(JSON.parse(inputJSON))
    })
    stdin.on('error', function () {
      reject(Error('error during read'))
    })
    stdin.on('timeout', function () {
      reject(Error('timout during read'))
    })
  })
}

// Main logic of the application
async function main() {
  let selectedOptions: { [key: string]: any } = await readJSONfromSTDIN();

  if (Object.keys(selectedOptions).length === 0)
    selectedOptions = await promptUser();
  
  await run(selectedOptions);
  process.exit(0);
}

// Call the main function
main();




