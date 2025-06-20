import { IProductInput } from '@/types'
import { Document, model, Model, models, Schema } from 'mongoose'

// Trong TypeScript, interface là một cấu trúc dùng để định nghĩa kiểu dữ liệu (type) cho một đối tượng (object).
export interface IProduct extends Document, IProductInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}
// Đây là class Schema của Mongoose, dùng để tạo một schema mô tả cấu trúc của tài liệu (document) MongoDB.
// IProduct là interface TypeScript định nghĩa kiểu dữ liệu (type-check) cho schema.
// Cú pháp <IProduct> giúp liên kết schema với interface trong TypeScript — điều này giúp bạn có hỗ trợ kiểu (type safety) trong khi code.
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    images: { type: [String] },
    brand: { type: String, required: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    listPrice: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    tags: { type: [String], default: ['new arrival'] },
    colors: { type: [String], default: ['Black', 'Red', 'White'] },
    sizes: { type: [String], default: ['S', 'M', 'L'] },
    avgRating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    ratingDistribution: [
      {
        rating: { type: Number, required: true },
      },
      {
        count: { type: Number, required: true },
      },
    ],
    numSales: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, required: true, default: false },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
  },
  {
    timestamps: true,
  },
)
// Trong môi trường như Next.js hoặc khi dùng ts-node-dev, mỗi lần thay đổi file,
// dự án có thể re-run lại, và nếu bạn gọi mongoose.model('Product', schema) nhiều lần với cùng tên sẽ gây lỗi:
const Product =
  // Kiểm tra xem model "Product" đã tồn tại trong models hay chưa.
  // Ép kiểu models.Product sang Model<IProduct>.
  // Model<IProduct> là kiểu của một model Mongoose có dữ liệu dạng IProduct.
  (models.Product as Model<IProduct>) ||
  // Khởi tạo model mới tên "Product" từ productSchema, với kiểu dữ liệu IProduct.
  model<IProduct>('Product', productSchema)

export default Product
