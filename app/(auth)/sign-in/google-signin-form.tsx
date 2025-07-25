'use client'

import { Button } from '@/components/ui/button'
import { SignInWithGoogle } from '@/lib/actions/user.action'
import { useFormStatus } from 'react-dom'

export function GoogleSignInForm() {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className='w-full' variant='outline'>
        {pending ? 'Redirecting to Google...' : 'Sign In with Google'}
      </Button>
    )
  }

  return (
    <form action={SignInWithGoogle}>
      <SignInButton />
    </form>
  )
}
