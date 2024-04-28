// This file exports the necessary types and interfaces used in your application

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export enum DataFlowDirection {
  import = 'import',
  export = 'export'
}

export interface GeneratorFactoryOptions {
  type: string,
  direction: DataFlowDirection
}

// Add more types and interfaces as needed