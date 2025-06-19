import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
import { connectToDatabase } from '.'
import data from '../data'
import Product from './models/product.model'
// Load environment variables from .env file
// This is useful for local development and testing
loadEnvConfig(cwd())

const main = async () => {
  try {
    const { products } = data
    await connectToDatabase(process.env.MONGODB_URL)
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)
    console.log(`Seeded ${createdProducts.length} products successfully`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding the database:', error)
    throw new Error('Database seeding failed')
  }
}

main()