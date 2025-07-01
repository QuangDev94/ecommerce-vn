import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { IOrder } from '../lib/db/models/order.model.ts'
import { Resend } from 'resend'
import PurchaseReceipEmail from './purchase-receipt'
import { formatId } from '@/lib/utils'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: (order.user as { email: string }).email,
    subject: `Order ${formatId(order._id)} Confirmation`,
    react: <PurchaseReceipEmail order={order} />,
  })
}
