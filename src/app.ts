// Import necessary modules and types
// import { User } from './types/index';
import select, { Separator } from '@inquirer/select';

enum Commands {
  Toggle = "Show/Hide Completed",
  Quit = "Quit"
}

/**
 * TODO:
 * 1. Add Medusa to Docekrfile
 * 2. Add Ollama to Docker file
 * 3. Use LLama3 via Docker
 */
async function promptUser() {
  const dfDirection = await select({
    message: 'Select the data flow direction',
    choices: [
      {
        name: 'Import to Medusa',
        value: 'toMedusa',
        description: 'Import data from external file, API or database TO Medusa',
      },
      {
        name: 'Export from Medusa',
        value: 'fromMedusa',
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
}

// Main logic of the application
function main() {
  promptUser();
}

// Call the main function
main();



