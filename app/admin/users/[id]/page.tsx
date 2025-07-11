import { notFound } from 'next/navigation'

import Link from 'next/link'
import { Metadata } from 'next'
import UserEditForm from './user-edit-form'
import { getUserById } from '@/lib/actions/user.action'

export const metadata: Metadata = {
  title: 'Edit User',
}

export default async function UserEditPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const user = await getUserById(id)
  if (!user) notFound()
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/users'>Users</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/users/${user._id}`}>
          Edit User <span className='italic font-bold'>{user.name}</span>
        </Link>
      </div>

      <div className='my-8'>
        <UserEditForm user={user} />
      </div>
    </main>
  )
}
