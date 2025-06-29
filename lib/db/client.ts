import { MongoClient, ServerApiVersion } from 'mongodb'

if (!process.env.MONGODB_URL) {
  throw new Error('Invalid/Missing enviroment variable: "MONGODB_URL"')
}

const url = process.env.MONGODB_URL
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient

if (process.env.NODE_ENV === 'development') {
  // In development , use a global variable so that the value
  // is preserved accross module reloads caused by HMR (Hot Module Replacement)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
  }
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(url, options)
  }
  client = globalWithMongo._mongoClient
} else {
  client = new MongoClient(url, options)
}

// Export a modult-scoped MongoClient. By doing this is a
// separate module , the client can be shared across functions.
export default client
