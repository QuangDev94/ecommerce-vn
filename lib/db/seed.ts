import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
import { connectToDatabase } from '.'
import data from '../data'
import Product from './models/product.model'
import User from './models/user.model'
import Review from './models/review.model'
// Load environment variables from .env file
// This is useful for local development and testing
loadEnvConfig(cwd())

const main = async () => {
  try {
    const { products, users, reviews } = data
    await connectToDatabase(process.env.MONGODB_URL)

    await User.deleteMany()
    const createdUser = await User.insertMany(users)
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)
    await Review.deleteMany()
    const rws = []
    for (let i = 0; i < createdProducts.length; i++) {
      let x = 0
      const { ratingDistribution } = createdProducts[i]
      for (let j = 0; j < ratingDistribution.length; j++) {
        for (let k = 0; k < ratingDistribution[j].count; k++) {
          x++
          rws.push({
            ...reviews.filter((x) => x.rating === j + 1)[
              x % reviews.filter((x) => x.rating === j + 1).length
            ],
            isVerifiedPurchase: true,
            product: createdProducts[i]._id,
            user: createdUser[x % createdUser.length]._id,
            updatedAt: Date.now(),
            createdAt: Date.now(),
          })
        }
      }
    }
    const createdReviewed = await Review.insertMany(rws)

    console.log(`Seeded ${createdUser.length} users successfully`)
    console.log(`Seeded ${createdProducts.length} products successfully`)
    console.log(`Seeded ${createdReviewed.length} reviews successfully`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding the database:', error)
    throw new Error('Database seeding failed')
  }
}

main()
