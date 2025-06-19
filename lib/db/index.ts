import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const catched = (global as any).catched || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URL = process.env.MONGODB_URL,
) => {
  if (catched.conn) {
    return catched.conn
  }

  if (!MONGODB_URL) {
    throw new Error('Please define the MONGODB_URL environment variable')
  }

  catched.promise = catched.promise || mongoose.connect(MONGODB_URL)
  catched.conn = await catched.promise
  return catched.conn
}
