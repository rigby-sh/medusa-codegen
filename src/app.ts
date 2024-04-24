// Import necessary modules and types
// import { User } from './types/index';
import select from '@inquirer/select';
import chalk from 'chalk';
import { ProductImporter } from './platforms/medusa';
import { AbstractImporter } from './platforms/abstract-importer';

const dataFlows = {
  'product-import': ProductImporter
}

/**
 * TODO:
 * 1. Add Medusa to Docekrfile
 * 2. Add Ollama to Docker file
 * 3. Use LLama3 via Docker
 */
async function promptUser() {
  console.log(chalk.green('Welcome to Medusa Integr') + chalk.bgCyan('ai'));
  const dfDirection = await select({
    message: 'Select the data flow direction',
    choices: [
      {
        name: 'Import to Medusa',
        value: 'import',
        description: 'Import data from external file, API or database TO Medusa',
      },
      {
        name: 'Export from Medusa',
        value: 'export',
        description: 'Export data to external file, API or database FROM Medusa',
      },
    ]
  });  
  const dfType = await select({
    message: 'Select the entity type',
    choices: [
      {
        name: 'product',
        value: 'product',
        description: 'Products',
      },
      {
        name: 'customer',
        value: 'customer',
        description: 'Customers',
      },
      {
        name: 'order',
        value: 'order',
        description: 'Orders',
      },
    ],
  });    

  (Object.create(dataFlows[`${dfType}-${dfDirection}` as keyof typeof dataFlows] as typeof AbstractImporter).prototype).run({});
}

// Main logic of the application
function main() {
  promptUser();
}

// Call the main function
main();



