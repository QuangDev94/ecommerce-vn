import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Search from './search'
import Menu from './menu'
import data from '@/lib/data'
import Sidebar from './sidebar'
import { getAllCategories } from '@/lib/actions/product.actions'

export default async function Header() {
  const categories = await getAllCategories()
  return (
    <header className='bg-black text-white'>
      <div className='px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center header-button font-extrabold text-2xl m-1'>
              <Image
                src='/icons/logo.svg'
                alt={`${APP_NAME} logo`}
                width={40}
                height={40}
              />
              QuangDev
            </Link>
          </div>
          <div className='hidden md:block flex-1 max-w-xl'>
            <Search />
          </div>
          <Menu />
        </div>
        <div className='md:hidden block py-2'>
          <Search />
        </div>
      </div>
      <div className='px-3 flex items-center mb-[1px] bg-gray-800'>
        <Sidebar categories={categories} />
        <div className='flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]'>
          {data.headerMenus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className='header-button !p-2'>
              {menu.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
