'use server'

import { auth, signIn, signOut } from '@/auth'
import { IUserName, IUserSignIn, IUserSignUp } from '@/types'
import { redirect } from 'next/navigation'
import { formatError } from '../utils'
import { UserSignUpSchema } from '../validator'
import { connectToDatabase } from '../db'
import bcrypt from 'bcryptjs'
import User, { IUser } from '../db/models/user.model'
import { revalidatePath } from 'next/cache'
import { PAGE_SIZE } from '../constants'
// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()

  const skipAmount = (Number(page) - 1) * limit
  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const usersCount = await User.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  }
}
// DELETE
export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const res = await User.findByIdAndDelete(id)
    if (!res) throw new Error('Use not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', {
    ...user,
    redirect: false,
  })
}
export const SignInWithGoogle = async () => {
  await signIn('google')
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
export async function updateUserName(userName: IUserName) {
  try {
    const session = await auth()
    await connectToDatabase()
    const currentUser = await User.findById(session?.user?.id)
    if (!currentUser) throw new Error('User not found')
    currentUser.name = userName.name
    const updatedUserName = await currentUser.save()
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUserName)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
