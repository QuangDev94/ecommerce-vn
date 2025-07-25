'use server'

import { PAGE_SIZE } from '../constants'
import { connectToDatabase } from '../db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'
import { ProductInputSchema, ProductUpdateSchema } from '../validator'
import { IProductInput } from '@/types'
import { z } from 'zod'
// CREATE
export async function createProduct(data: IProductInput) {
  try {
    const product = ProductInputSchema.parse(data)
    await connectToDatabase()
    await Product.create(product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// UPDATE
export async function updateProduct(data: z.infer<typeof ProductUpdateSchema>) {
  try {
    const product = ProductUpdateSchema.parse(data)
    await connectToDatabase()
    await Product.findByIdAndUpdate(product._id, product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// GET ONE PRODUCT BY ID
export async function getProductById(productId: string) {
  await connectToDatabase()
  const product = await Product.findById(productId)
  return JSON.parse(JSON.stringify(product)) as IProduct
}
export async function getAllCategories() {
  await connectToDatabase()
  // distinct: Trả về các giá trị duy nhất của trường 'category' trong các sản phẩm.
  const categories = await Product.find({ isPublished: true }).distinct(
    'category',
  )

  return categories
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find(
    // Điều kiện lọc (filter)
    {
      // Tìm kiếm sản phẩm có tag nhất định
      // $in: tìm kiếm trong mảng tags của sản phẩm.
      tags: { $in: [tag] },
      isPublished: true,
    },
    // Chỉ lấy các trường cần thiết (projection)
    {
      // lấy trường name
      name: 1,
      // lấy slug để tạo đường dẫn href
      // nối chuỗi '/product/' với slug của sản phẩm.
      href: { $concat: ['/product/', '$slug'] },
      // tạo trường image
      // lấy ảnh đầu tiên trong mảng images của sản phẩm.
      image: { $arrayElemAt: ['$images', 0] },
    },
  )
    .sort({ createdAt: 'desc' })
    .limit(limit)

  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}

export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit)

  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true })
  if (!product) throw new Error('Product not found!')
  return JSON.parse(JSON.stringify(product)) as IProduct
}

export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page: number
}) {
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }
  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const productsCount = await Product.countDocuments(conditions)
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}
// Get All Products
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  limit?: number
  page: number
  category: string
  tag: string
  price?: string
  rating?: string
  sort?: string
}) {
  limit = limit || PAGE_SIZE
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}
  const categoryFilter = category && category !== 'all' ? { category } : {}
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {}
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]), //10-50
          },
        }
      : {}
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const isPublished = { isPublished: true }
  await connectToDatabase()
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()
  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  }
}
export async function getAllTags() {
  // Aggregation giống như một dây chuyền: dữ liệu đi qua từng bước (stage) để được xử lý, lọc,
  // tính toán, rồi cho ra kết quả cuối cùng.
  // tất cả trong một chuỗi các bước gọi là pipeline (đường ống xử lý).
  const tags = await Product.aggregate([
    // $unwind sẽ tách từng phần tử trong mảng tags thành các document riêng biệt, giúp xử lý từng tag riêng lẻ.
    { $unwind: '$tags' },
    // $group sẽ nhóm các document lại theo trường tags, và tạo một mảng chứa tất cả các tag duy nhất.
    // _id: null: không nhóm theo trường nào, chỉ cần một mảng duy nhất.
    // $addToSet: tạo một mảng chứa các giá trị duy nhất của trường tags.
    {
      $group: { _id: null, uniqueTags: { $addToSet: '$tags' } },
    },
    {
      $project: { _id: 0, uniqueTags: 1 },
    },
  ])

  return (
    (tags[0]?.uniqueTags
      // sắp xếp các tag theo thứ tự chữ cái
      .sort((a: string, b: string) => a.localeCompare(b))
      // chuyển đổi từng tag thành dạng title case (chữ cái đầu tiên viết hoa)
      // ví dụ: 'new-arrival' -> 'New Arrival'
      .map((x: string) =>
        x
          .split('-')
          // chuyển đổi từng từ trong tag thành chữ hoa chữ cái đầu tiên
          // slice(1): lấy phần còn lại của từ sau chữ cái đầu tiên
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      ) as string[]) || []
  )
}
// DELETE
export async function deleteProduct(id: string) {
  try {
    await connectToDatabase()
    const res = await Product.findByIdAndDelete(id)
    if (!res) throw new Error('Product not found')
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// GET ALL PRODUCTS FOR ADMIN
// Lấy danh sách sản phẩm với tính năng tìm kiếm bằng name, phân trang và sắp xếp
export async function getAllProductsForAdmin({
  query,
  page = 1,
  sort = 'latest',
  limit,
}: {
  query: string
  page?: number
  sort?: string
  limit?: number
}) {
  await connectToDatabase()

  const pageSize = limit || PAGE_SIZE
  // Tìm kiếm sản phẩm theo tên(name)
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            // dùng biểu thức chính quy để tìm sản phẩm chứa từ khóa.
            // $regex: tìm kiếm theo mẫu (pattern) trong chuỗi.
            // Tìm kiếm theo tên sản phẩm như: "Áo" sẽ khớp với "áo thun", "ÁO KHOÁC", v.v.
            $regex: query,
            // tìm không phân biệt chữ hoa/thường (insensitive).
            $options: 'i',
          },
        }
      : {}
  // khai báo kiểu của order rõ ràng — là object có key là string, value là 1 hoặc -1.
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 } // Mặc định sắp xếp theo ngày tạo mới nhất (latest).
  const products = await Product.find({
    ...queryFilter,
  })
    .sort(order)
    .skip(pageSize * (Number(page) - 1))
    .limit(pageSize)
    .lean() //Trả về plain JavaScript object thay vì mongoose document (nhẹ hơn, không có hàm .save()…)

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / pageSize),
    totalProducts: countProducts,
    from: pageSize * (Number(page) - 1) + 1,
    to: pageSize * (Number(page) - 1) + products.length,
  }
}
