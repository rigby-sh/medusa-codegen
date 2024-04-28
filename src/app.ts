// Import necessary modules and types
// import { User } from './types/index';
import select from '@inquirer/select';
import chalk from 'chalk';
import { generatorFactory, dataFlowSetupOptions } from './platforms/medusa';
import { DataFlowDirection } from './types';
import { AbstractGenerator } from './types/abstract-generator';
import { input } from '@inquirer/prompts';



/**
 * TODO:
 * 1. Add Medusa to Docekrfile
 * 2. Add Ollama to Docker file
 * 3. Use LLama3 via Docker
 */
async function promptUser() {
  console.log(chalk.green('Welcome to Medusa Integr') + chalk.bgCyan('ai'));

  const dataFlowOptions: { [key: string]: any } = {
  }

  for (const key in dataFlowSetupOptions) {
    const setupOption = dataFlowSetupOptions[key]; // prompt user for the required data flown
    if(setupOption.type === 'select' ) {
      dataFlowOptions[key] = await select(setupOption);
    } else if(setupOption.type === 'input') {
      dataFlowOptions[key] = await input(setupOption);
    }
  }

  console.log(dataFlowOptions);

// productImportGenerator usage
  const generator:AbstractGenerator = generatorFactory({
    type: dataFlowOptions['dataFlowType'],
    direction: dataFlowOptions['dataFlowDirection'] as DataFlowDirection
  });
  generator.run({
    medusaUrl: 'http://medusa:9000/admin',
    userPrompt: dataFlowOptions['userPrompt']
  }) as any;
}

// Main logic of the application
function main() {
  console.log('aa');
  promptUser();
}

// Call the main function
main();



