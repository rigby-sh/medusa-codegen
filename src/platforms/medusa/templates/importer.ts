import * as fs from 'fs';
import MedusaClient from '@medusajs/medusa-js';

const medusa = new MedusaClient({
  baseUrl: 'http://medusa:9000/admin',
  maxRetries: 3,
});

const inputPath = process.cwd() + '/input';

const runImport = async () => {
};

runImport();