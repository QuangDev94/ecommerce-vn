import {
  CartSchema,
  OrderInputSchema,
  OrderItemSchema,
  ProductInputSchema,
  ReviewInputSchema,
  ShippingAddressSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
} from '@/lib/validator'
import { z } from 'zod'

// z.infer<T> Đây là utility type của Zod.
// Nó sẽ suy ra (infer) kiểu TypeScript từ một schema Zod đã định nghĩa trước.
// Nói cách khác, nó giúp bạn chuyển một schema Zod thành kiểu TypeScript tương ứng.
export type IProductInput = z.infer<typeof ProductInputSchema>

export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}
export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  reviews: {
    title: string
    comment: string
    rating: number
  }[]
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
// Order
export type OrderItem = z.infer<typeof OrderItemSchema>
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type IOrderList = IOrderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Date
}
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>
// User
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>
