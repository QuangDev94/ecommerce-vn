'use client'

import Rating from '@/components/product/rating'
import RatingSummary from '@/components/shared/product/rating-summary'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from '@/lib/actions/review.action'
import { IProduct } from '@/lib/db/models/product.model'
import { ReviewInputSchema } from '@/lib/validator'
import { IReviewDetails, IReviewInput } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'

const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({
  userId,
  product,
}: {
  userId: string | undefined
  product: IProduct
}) {
  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const [isOpenReviewCreatingForm, setIsOpenReviewCreatingForm] =
    useState(false)
  const [page, setPage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const loadMoreReviews = async () => {
    if (totalPages !== 0 && page > totalPages) return
    setIsLoadingReviews(true)
    const res = await getReviews({ productId: product._id, page })
    setIsLoadingReviews(false)
    setReviews([...reviews, ...res.data])
    setTotalPages(res.totalPages)
    setPage(page + 1)
  }
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoadingReviews(true)
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      setIsLoadingReviews(false)
    }
    if (inView) {
      loadReviews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])
  const form = useForm<IReviewInput>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  })
  const reload = async () => {
    try {
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error in fetching reviews',
      })
    }
  }
  const handleOpenForm = async () => {
    form.setValue('product', product._id)
    // userId! là non-null assertion operator trong typescript
    // báo cho ts rằng userId chắc chắn ko null hoặc undefined
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)
    const review = await getReviewByProductId({ productId: product._id })
    if (review) {
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
    }
    setIsOpenReviewCreatingForm(true)
  }
  const onSumitForm: SubmitHandler<IReviewInput> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: product._id },
      path: `product/${product.slug}`,
    })
    if (!res.success) {
      return toast({ variant: 'destructive', description: res.message })
    }
    setIsOpenReviewCreatingForm(false)
    reload()
    toast({ description: res.message })
  }
  console.log('reviews: ', reviews)
  return (
    <div className='space-y-2'>
      {reviews.length === 0 && <div>No reviews yet</div>}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div className='flex flex-col gap-2'>
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={product.ratingDistribution}
            />
          )}
          <Separator />
          <div className='space-y-3'>
            <h3 className='font-bold text-lg lg:text-xl'>
              Review this product
            </h3>
            <p className='text-sm'>Share your thoughts with other customers</p>
            {userId ? (
              <Dialog
                open={isOpenReviewCreatingForm}
                onOpenChange={setIsOpenReviewCreatingForm}>
                <Button
                  className='rounded-full w-full'
                  variant='outline'
                  onClick={handleOpenForm}>
                  Write a customer review
                </Button>
                <DialogContent className='sm:max-w-[425px]'>
                  <Form {...form}>
                    <form
                      method='post'
                      onSubmit={form.handleSubmit(onSumitForm)}>
                      <DialogHeader>
                        <DialogTitle>Write a customer review</DialogTitle>
                        <DialogDescription>
                          Share your thoughts with other customers
                        </DialogDescription>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='flex flex-col gap-5'>
                          <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder='Enter title' {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter comment'
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='rating'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>Rating</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select a rating' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <SelectItem
                                          key={index}
                                          value={(index + 1).toString()}>
                                          <div className='flex items-center gap-1'>
                                            {index + 1}{' '}
                                            <StarIcon className='h-4 w-4' />
                                          </div>
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type='submit'
                          size='lg'
                          disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting
                            ? 'Submitting...'
                            : 'Submit'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                Please{' '}
                <Link
                  className='highlight-link'
                  href={`/sign-in?callbackUrl=/product/${product.slug}`}>
                  sign in
                </Link>{' '}
                to write a review
              </div>
            )}
          </div>
        </div>
        <div className='md:col-span-3 flex flex-col gap-3'>
          {reviews.map((review: IReviewDetails) => (
            <Card key={review._id}>
              <CardHeader>
                <div className='flex-between'>
                  <CardTitle>{review.title}</CardTitle>
                  <div className='italic text-sm flex'>
                    <Check className='h-4 w-4' /> Verified Purchase
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex space-x-4 text-sm text-muted-foreground'>
                  <Rating rating={review.rating} />
                  <div className='flex items-center'>
                    <User className='mr-1 h-3 w-3' />
                    {review.user ? review.user.name : 'Deleted user'}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-1 h-3 w-3' />
                    {review.createdAt.toString().substring(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}>
            {page <= totalPages && (
              <Button variant='link' onClick={loadMoreReviews}>
                See more reviews
              </Button>
            )}
            {page < totalPages && isLoadingReviews && 'Loading ...'}
          </div>
        </div>
      </div>
    </div>
  )
}
