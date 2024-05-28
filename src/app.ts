// Import necessary modules and types
// import { User } from './types/index';
import select from '@inquirer/select';
import chalk from 'chalk';
import { generatorFactory, dataFlowParameters, parameterOptions } from './platforms/medusa';
import { DataFlowDirection } from './types';
import { AbstractGenerator } from './types/abstract-generator';
import { checkbox, input } from '@inquirer/prompts';



/**
 * TODO:
 * 1. Add Medusa to Docekrfile
 * 2. Add Ollama to Docker file
 * 3. Use LLama3 via Docker
 */
async function promptUser() {
  console.log(chalk.green('Welcome to Medusa Integr') + chalk.bgCyan('ai'));

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

  console.log(selectedOptions);

// productImportGenerator usage
  const generator:AbstractGenerator = generatorFactory({
    type: selectedOptions['dataFlowType'],
    direction: selectedOptions['dataFlowDirection'] as DataFlowDirection
  });
  generator.run({
    ...selectedOptions,
    medusaUrl: process.env.MEDUSA_BACKEND_URL
  }) as any;
}

// Main logic of the application
function main() {
  promptUser();
}

// Call the main function
main();



