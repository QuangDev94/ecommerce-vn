import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { signOutAction } from '@/lib/actions/user.action'
import { ChevronRight, MenuIcon, UserCircle, X } from 'lucide-react'
import Link from 'next/link'

export default async function Sidebar({
  categories,
}: {
  categories: string[]
}) {
  const session = await auth()
  return (
    <Drawer direction='left'>
      <DrawerTrigger className='header-button flex items-center !p-2'>
        <MenuIcon className='h-5 w-5 mr-1' />
        All
      </DrawerTrigger>
      <DrawerContent className='w-[350px] mt-0 top-0'>
        <div className='flex flex-col h-full'>
          {/* User Sign In Section */}
          <div className='dark bg-gray-800 text-foreground flex items-center justify-between'>
            <DrawerHeader>
              <DrawerTitle className='flex items-center'>
                <UserCircle className='h-6 w-6 mr-2' />
                {session ? (
                  <DrawerClose asChild>
                    <Link href='/account'>
                      <span className='text-lg font-semibold'>
                        Hello, {session.user.name}
                      </span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href='/sign-in'>
                      <span className='text-lg font-semibold'>
                        Hello, Sign in
                      </span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='mr-2'>
                <X className='h-5 w-5' />
                <span className='sr-only'>Close</span>
              </Button>
            </DrawerClose>
          </div>
          {/* Shop By Category */}
          <div className='flex-1 overflow-y-auto'>
            <div className='p-4 border-b'>
              <h2 className='text-lg font-semibold'>Shop By Department</h2>
            </div>
            <nav className='flex flex-col'>
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className='flex items-center justify-between item-button'>
                    <span>{category}</span>
                    <ChevronRight />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>
          {/* Setting And Help */}
          <div className='border-t flex flex-col'>
            <div className='p-4'>
              <h2 className='text-lg font-semibold'>Help & Settings</h2>
            </div>
            <DrawerClose asChild>
              <Link href='/account' className='item-button'>
                Your Account
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href='/page/customer-service' className='item-button'>
                Customer Service
              </Link>
            </DrawerClose>
            {session ? (
              <form action={signOutAction} className='w-full'>
                <Button
                  variant='ghost'
                  className='w-full justify-start item-button text-base'>
                  Sign out
                </Button>
              </form>
            ) : (
              <Link href='/sign-in' className='item-button'>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
