export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Ecommerce VN'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Ecommerce VN is a modern e-commerce platform built with Next.js and Tailwind CSS.'
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLOGAN || 'Shop the best products online'
export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright @ 2025 ${APP_NAME}. All rights reserved.`
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const FREE_SHIPPING_MIN_PRICE =
  Number(process.env.FREE_SHIPPING_MIN_PRICE) || 35
export const AVAILABLE_PAYMENT_METHOD = [
  {
    name: 'Paypal',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Stripe',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Cash On Delivery',
    commission: 0,
    isDefault: true,
  },
]
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'Paypal'
export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',
    daysToDelivery: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 3 Days',
    daysToDelivery: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 5 Days',
    daysToDelivery: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 350,
  },
]
