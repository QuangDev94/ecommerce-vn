import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
import { connectToDatabase } from '.'
import data from '../data'
import Product from './models/product.model'
import User from './models/user.model'
// Load environment variables from .env file
// This is useful for local development and testing
loadEnvConfig(cwd())

const main = async () => {
  try {
    const { products, users } = data
    await connectToDatabase(process.env.MONGODB_URL)

    await User.deleteMany()
    const createdUser = await User.insertMany(users)
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)
    console.log(`Seeded ${createdUser.length} users successfully`)
    console.log(`Seeded ${createdProducts.length} products successfully`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding the database:', error)
    throw new Error('Database seeding failed')
  }
}

main()
