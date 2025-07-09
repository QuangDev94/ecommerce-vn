'use client'

import useCartSizebar from '@/hooks/use-cart-sizebar'
import CartSidebar from './cart-sidebar'
import { Toaster } from '../ui/toaster'
import { ThemeProvider } from './theme-provider'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const isCartSideBarOpen = useCartSizebar()

  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      {isCartSideBarOpen ? (
        <div className='flex min-h-screen'>
          <div className='flex-1 overflow-hidden'>{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </ThemeProvider>
  )
}
