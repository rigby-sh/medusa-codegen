import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = 'http://medusa:9000/admin'
const MEUDUSA_USERNAME = ''
const MEDUSA_PASSWORD = ''

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })

const initMedusaSession = async (): Promise<any> => {
    const userData = await medusa.admin.auth.createSession({
        email: MEUDUSA_USERNAME,
        password: MEDUSA_PASSWORD,
    })
        .then(({ user }) => {
        console.log(user.id);
    })
    return userData
}

const inputPath = process.cwd() + '/input';

const importSingleProduct = async (product:any) => {
  return medusa.admin.products.create(product)
  .then(({ product }) => {
    console.log(product.id);
  })
}

const transformSourceDataToMedusa = (sourceRecord: any): any => {
    return sourceRecord
}

const runImport = async () => {
};

const adminUser = initMedusaSession()
runImport();