'use client'

import Rating from '@/components/product/rating'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'

type RatingSummaryProps = {
  asPopover?: boolean
  avgRating: number
  numReviews: number
  ratingDistribution: {
    rating: number
    count: number
  }[]
}

export default function RatingSummary({
  asPopover,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
}: RatingSummaryProps) {
  const RatingDistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),
    }))
    return (
      <>
        <div className='flex flex-wrap items-center gap-1 cursor-help'>
          <Rating rating={avgRating} />
          <span className='text-lg font-semibold'>
            {avgRating.toFixed(1)} out of 5
          </span>
        </div>
        <div className='text-lg'>{numReviews} ratings</div>
        <div className='space-y-3'>
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage }) => (
              <div
                key={rating}
                className='grid grid-cols-[50px_1fr_30px] items-center gap-2'>
                <div className='text-sm'>{rating} star</div>
                <Progress value={percentage} className='h-4' />
                <div className='text-sm text-right'>{percentage}%</div>
              </div>
            ))}
        </div>
      </>
    )
  }
  return asPopover ? (
    <div className='flex items-center gap-1'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='px-2 [&_svg]:size-6 text-base'>
            <span>{avgRating.toFixed(1)}</span>
            <Rating rating={avgRating} />
            <ChevronDownIcon className='w-5 h-5 text-muted-foreground' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-4' align='end'>
          <div className='flex flex-col gap-2'>
            <RatingDistribution />
            <Separator />
            <Link href='#reviews' className='highlight-link text-center'>
              See customer reviews
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      <div>
        <Link href='#reviews' className='highlight-link'>
          {numReviews} ratings
        </Link>
      </div>
    </div>
  ) : (
    <RatingDistribution />
  )
}
