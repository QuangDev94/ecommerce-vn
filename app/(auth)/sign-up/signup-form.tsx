'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.action'
import { APP_NAME } from '@/lib/constants'
import { UserSignUpSchema } from '@/lib/validator'
import { IUserSignUp } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'QuangDev',
        email: 'quangdev@gmail.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

export default function SignUpForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit } = form
  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data)
      if (!res.success) {
        toast({
          title: 'Error',
          description: res.error,
          variant: 'destructive',
        })
        return
      }
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-6'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter confirmPassword'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <Button type='submit'>Sign Up</Button>
          </div>
          <div className='text-sm'>
            By creating an account , you agree to {APP_NAME}&apos;s{' '}
            <Link href='/page/conditions-of-use'>Conditions of use</Link> and{' '}
            <Link href='/page/privacy-policy'>Privacy Notice. </Link>
          </div>
          <Separator className='mb-4' />
          <div className='text-sm'>
            Already have an account?{' '}
            <Link className='link' href={`/sign-in?callbackUrl=${callbackUrl}`}>
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
