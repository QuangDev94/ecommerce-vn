import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { IOrder } from '../lib/db/models/order.model.ts'
import { Resend } from 'resend'
import PurchaseReceipEmail from './purchase-receipt'
import AskReviewOrderItemsEmail from './ask-review-order-items'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    //to: (order.user as { email: string }).email,
    to: 'qagnguyen.dev@gmail.com',
    subject: `Order Confirmation`,
    react: <PurchaseReceipEmail order={order} />,
  })
}

export const sendAskReviewOrderItems = async ({ order }: { order: IOrder }) => {
  const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: 'Review your order items',
    react: <AskReviewOrderItemsEmail order={order} />,
    scheduledAt: oneDayFromNow,
  })
}
