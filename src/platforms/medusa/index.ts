import { GeneratorFactoryOptions } from '../../types';
import { AbstractGenerator, GeneratorOptions } from '../../types/abstract-generator'
import { MedusaProductImportGenerator } from './import-generators/product-import'

const supportedDataFlows: { [key: string]: typeof AbstractGenerator } = {
    'product-import': MedusaProductImportGenerator
}

const dataFlowSetupOptions: { [key: string]: any } ={
    'dataFlowDirection': {
        type: 'select',
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
      },
      'dataFlowType': {
        type: 'select',
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
      },
      'userPrompt': {
        type: 'input',
        message: 'Enter a detailed description of the data flow input/output - for example: Generate the import from CSV file of the following structure: (id, name, price)',
        validate: (input: string) => {
          if (!input) {
            return 'The custom prompt is required for the generator to run';
          }
          return true;
        },
      },
}


function generatorFactory(options: GeneratorFactoryOptions): AbstractGenerator {
    // Add your code here
    const mappedType = supportedDataFlows[`${options.type}-${options.direction}`];
    if(!mappedType) throw new Error(`Unsupported data flow type: ${options.type}-${options.direction}`);
    return (Object.create(mappedType as typeof AbstractGenerator).prototype);
}

export {  
  generatorFactory,
  supportedDataFlows,
  dataFlowSetupOptions
}
