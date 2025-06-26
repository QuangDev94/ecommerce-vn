import {
  CartSchema,
  OrderItemSchema,
  ProductInputSchema,
} from '@/lib/validator'
import { z } from 'zod'

// z.infer<T> Đây là utility type của Zod.
// Nó sẽ suy ra (infer) kiểu TypeScript từ một schema Zod đã định nghĩa trước.
// Nói cách khác, nó giúp bạn chuyển một schema Zod thành kiểu TypeScript tương ứng.
export type IProductInput = z.infer<typeof ProductInputSchema>

export type Data = {
  products: IProductInput[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
}

export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
