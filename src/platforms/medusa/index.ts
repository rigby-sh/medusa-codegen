import { GeneratorFactoryOptions } from '../../types';
import { AbstractGenerator, GeneratorOptions } from '../../types/abstract-generator'
import { MedusaProductImportGenerator } from './import-generators/product-import'
import medusaProductFields from './specs/products-import.json'

const supportedDataFlows: { [key: string]: typeof AbstractGenerator } = {
    'product-import': MedusaProductImportGenerator
}

const dataFlowParameters = ['dataFlowDirection', 'dataFlowType', 'fields', 'inputSource'];

/**
 * Returns the options for the given parameter
 */
const parameterOptions = (key: string, selectedOptions: { [key: string]: any }): any => 
{
  switch (key) {  
    case 'dataFlowDirection':
      return {
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
     } 
    case 'dataFlowType': 
      return {
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
      }
      case 'fields': {
        if (selectedOptions['dataFlowType'] === 'product') {
          return {
            type: 'checkbox',
            message: 'Which fields would you like to import?',
            choices: medusaProductFields.map(p => {
              return {
                name: p.field_name,
                value: p.field_name,
                description: p.description,
              }
            }),
            validate: (input: string) => {
              if (!input) {
                return 'The fields list is required for the generator to run';
              }
              return true;
            },
          
          }
        }
      }
      case 'inputSource': return {
        type: 'input',
        message: 'Enter a detailed description of the data data source - include the credentials for database or file name (located in `input` folder) where suited:',
        validate: (input: string) => {
          if (!input) {
            return 'The inputSource is required for the generator to run';
          }
          return true;
        },
      }
    }
    throw new Error(`Unsupported parameter: ${key}`);
}


const generatorFactory = (options: GeneratorFactoryOptions): AbstractGenerator => {
    // Add your code here
    const mappedType = supportedDataFlows[`${options.type}-${options.direction}`];
    if(!mappedType) throw new Error(`Unsupported data flow type: ${options.type}-${options.direction}`);
    return (Object.create(mappedType as typeof AbstractGenerator).prototype);
}

export {  
  generatorFactory,
  supportedDataFlows,
  dataFlowParameters,
  parameterOptions
}
