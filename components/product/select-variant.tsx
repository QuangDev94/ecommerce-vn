import { IProduct } from '@/lib/db/models/product.model'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: IProduct
  size: string
  color: string
}) {
  const selectedColor = color || product.colors[0]
  const selectedSize = size || product.sizes[0]
  return (
    <>
      {product.colors.length > 0 && (
        <div className='space-x-2 space-y-2'>
          <div>Color:</div>
          {product.colors.map((color: string) => (
            <Button
              asChild
              variant='outline'
              className={
                selectedColor === color ? 'border-2 border-primary' : 'border-2'
              }
              key={color}>
              {/* replace Thay thế URL hiện tại, không lưu vào lịch sử */}
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color,
                  size: selectedSize,
                })}`}
                key={color}>
                <div
                  style={{ backgroundColor: color }}
                  className='h-4 w-4 rounded-full border border-muted-foreground'></div>
                {color}
              </Link>
            </Button>
          ))}
        </div>
      )}
      {product.sizes.length > 0 && (
        <div className='mt-2 space-x-2 space-y-2'>
          <div>Sizes:</div>
          {product.sizes.map((size: string) => (
            <Button
              asChild
              variant='outline'
              className={
                selectedSize === size ? 'border-2 border-primary' : 'border-2'
              }
              key={size}>
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size,
                })}`}>
                {size}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  )
}
