'use server'

import { signIn, signOut } from '@/auth'
import { IUserSignIn, IUserSignUp } from '@/types'
import { redirect } from 'next/navigation'
import { formatError } from '../utils'
import { UserSignUpSchema } from '../validator'
import { connectToDatabase } from '../db'
import User from '../db/models/user.model'
import bcrypt from 'bcryptjs'

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', {
    ...user,
    redirect: false,
  })
}

export const signOutAction = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

export async function registerUser(userSignUp: IUserSignUp) {
  try {
    // parseAsync dùng khi trong schema có thể chứa các validate bất đồng bộ như 
    // .refine(async (...)) hoặc dùng await bên trong schema.
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })
    await connectToDatabase()
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    })
    return { success: true, message: 'User created successfully!' }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}
