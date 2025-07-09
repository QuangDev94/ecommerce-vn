'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { getFilterUrl } from '@/lib/utils'

export default function ProductSortSelector({
  sortOrders,
  sort,
  params,
}: {
  sortOrders: { value: string; name: string }[]
  sort: string
  params: {
    q?: string
    category?: string
    price?: string
    sort?: string
    rating?: string
    page?: string
  }
}) {
  const router = useRouter()

  return (
    <Select
      onValueChange={(v) => {
        router.push(getFilterUrl({ params, sort: v }))
      }}
      value={sort}>
      <SelectTrigger>
        <SelectValue>
          Sort By: {sortOrders.find((s) => s.value === sort)!.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortOrders.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
