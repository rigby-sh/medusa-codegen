import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = 'http://medusa:9000/admin'
const MEUDUSA_USERNAME = ''
const MEDUSA_PASSWORD = ''

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.admin.auth.createSession({
  email: MEUDUSA_USERNAME,
  password: MEDUSA_PASSWORD,
})
.then(({ user }) => {
  console.log(user.id);
})

const inputPath = process.cwd() + '/input';

const runImport = async () => {
};

runImport();