'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/lib/utils'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })
    router.push(newUrl, { scroll: true })
  }
  return (
    <div className='flex items-center gap-2'>
      <Button
        size='lg'
        variant='outline'
        disabled={Number(page) <= 1}
        className='w-24'
        onClick={() => handleClick('prev')}>
        <ChevronLeft /> Previous
      </Button>
      Page {page} of {totalPages}
      <Button
        size='lg'
        variant='outline'
        disabled={Number(page) >= totalPages}
        className='w-24'
        onClick={() => handleClick('next')}>
        <ChevronRight /> Next
      </Button>
    </div>
  )
}

export default Pagination
