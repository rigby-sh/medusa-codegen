import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = 'http://medusa:9000/'
const MEUDUSA_USERNAME = ''
const MEDUSA_PASSWORD = ''

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })

const getMedusaToken = async (): Promise<string> => {
  return medusa.admin.auth.getToken({
      email: MEUDUSA_USERNAME,
      password: MEDUSA_PASSWORD,
  })
  .then(({ access_token }) => {
      console.log('Medusa Access Token: ' + access_token);
      return access_token;
  })
}

const inputPath = process.cwd() + '/input/products.csv';

const importSingleProduct = async (product:any, apiToken:string) => {
  console.log("Product in Medusa format: ", product)
  return medusa.admin.products.create(product, { Authorization: ' Bearer ' + apiToken })
  .then(({ product }) => {
    console.log("Product successfully added with ID: " + product.id);
  })
}

const transformSourceDataToMedusa = (sourceRecord: any): any => {
  console.log("Product in source format: ", sourceRecord)
  return sourceRecord
}

const runImport = async () => {
  const apiToken:string = await getMedusaToken()
};

runImport();