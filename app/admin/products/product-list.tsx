/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  deleteProduct,
  getAllProductsForAdmin,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'

import React, { useEffect, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateTime, formatId } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import DeleteDialog from '@/components/shared/delete-dialog'

type ProductListDataProps = {
  products: IProduct[]
  totalPages: number
  totalProducts: number
  to: number
  from: number
}
const ProductList = () => {
  const [page, setPage] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [data, setData] = useState<ProductListDataProps>()
  // xử lý các "transition updates" (cập nhật chuyển tiếp)
  // Trong React, khi bạn cập nhật state, React sẽ tái render lại component.
  // Nếu việc cập nhật đó tốn thời gian (ví dụ: render danh sách lớn), giao diện có thể bị "đơ".
  // useTransition cho phép bạn đánh dấu một phần cập nhật là "ít quan trọng hơn" (non-urgent),
  // để React ưu tiên các cập nhật khẩn cấp (ví dụ: click, nhập liệu) trước.
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (changeType: 'next' | 'prev') => {
    //cập nhật khẩn cấp (urgent) — phản hồi ngay lập tức với người dùng.
    const newPage = changeType === 'next' ? page + 1 : page - 1
    if (changeType === 'next') {
      setPage(newPage)
    } else {
      setPage(newPage)
    }
    // cập nhật chuyển tiếp — được chạy trong startTransition()
    startTransition(async () => {
      const data = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      })
      setData(data)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // cập nhật khẩn cấp (urgent)
    setInputValue(value)
    if (value) {
      // cập nhật chuyển tiếp
      clearTimeout((window as any).debounce)
      // Tạo delay 500ms sau lần gõ cuối cùng mới gọi API.
      // tạo (hoặc truy cập) một thuộc tính tùy ý trên window tên là debounce
      // Mục đích: dùng để lưu trữ ID của timeout đã tạo bằng setTimeout.
      // Dùng useRef() (tốt hơn trong React)
      ;(window as any).debounce = setTimeout(() => {
        startTransition(async () => {
          const data = await getAllProductsForAdmin({ query: value, page: 1 })
          setData(data)
        })
      }, 500)
    } else {
      startTransition(async () => {
        const data = await getAllProductsForAdmin({ query: '', page })
        setData(data)
      })
    }
  }
  useEffect(() => {
    startTransition(async () => {
      const data = await getAllProductsForAdmin({ query: '' })
      setData(data)
    })
  }, [])

  return (
    <div>
      <div className='space-y-2'>
        <div className='flex-between flex-wrap gap-2'>
          <div className='flex flex-wrap items-center gap-2 '>
            <h1 className='font-bold text-lg'>Products</h1>
            <div className='flex flex-wrap items-center  gap-2 '>
              <Input
                className='w-auto'
                type='text '
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Filter name...'
              />

              {isPending ? (
                <p>Loading...</p>
              ) : (
                <p>
                  {data?.totalProducts === 0
                    ? 'No'
                    : `${data?.from}-${data?.to} of ${data?.totalProducts}`}
                  {' results'}
                </p>
              )}
            </div>
          </div>

          <Button asChild variant='default'>
            <Link href='/admin/products/create'>Create Product</Link>
          </Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className='text-right'>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product: IProduct) => (
                <TableRow key={product._id}>
                  <TableCell>{formatId(product._id)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product._id}`}>
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-right'>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>{product.avgRating}</TableCell>
                  <TableCell>{product.isPublished ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {formatDateTime(product.updatedAt).dateTime}
                  </TableCell>
                  <TableCell className='flex gap-1'>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/admin/products/${product._id}`}>Edit</Link>
                    </Button>
                    <Button asChild variant='outline' size='sm'>
                      <Link target='_blank' href={`/product/${product.slug}`}>
                        View
                      </Link>
                    </Button>
                    <DeleteDialog
                      id={product._id}
                      action={deleteProduct}
                      callbackAction={() => {
                        startTransition(async () => {
                          const data = await getAllProductsForAdmin({
                            query: inputValue,
                          })
                          setData(data)
                        })
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(data?.totalPages ?? 0) > 1 && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => handlePageChange('prev')}
                disabled={Number(page) <= 1}
                className='w-24'>
                <ChevronLeft /> Previous
              </Button>
              Page {page} of {data?.totalPages}
              <Button
                variant='outline'
                onClick={() => handlePageChange('next')}
                disabled={Number(page) >= (data?.totalPages ?? 0)}
                className='w-24'>
                Next <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
