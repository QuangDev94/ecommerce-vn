import { Star } from 'lucide-react'

export default function Rating({
  rating = 0,
  size = 6,
}: {
  rating: number
  size?: number
}) {
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const emptyStars = 5 - Math.ceil(rating)
  return (
    <div
      className='flex items-center'
      aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className={`w-${size} h-${size} fill-primary text-primary`}
        />
      ))}
      {partialStar > 0 && (
        <div className='relative'>
          <Star className={`w-${size} h-${size} text-primary`} />
          <div
            className='absolute top-0 left-0 overflow-hidden'
            style={{ width: `${partialStar * 100}%` }}>
            <Star className='w-6 h-6 fill-primary text-primary' />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className={`w-${size} h-${size} text-primary`}
        />
      ))}
    </div>
  )
}
