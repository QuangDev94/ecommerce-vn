import { ReactNode } from 'react'

const SeparatorWithOr = ({ children }: { children?: ReactNode }) => {
  return (
    <div className='h-5 border-b w-full my-5 text-center'>
      <span className='bg-background absolute left-1/2 -translate-x-1/2 mt-2 text-gray-500'>
        {/* 
            nullish coalescing operator (??).
            Nếu children khác null và undefined → hiển thị children
            Ngược lại → hiển thị chuỗi 'or'
            Khác với || (toán tử OR logic), ?? không coi "", 0, false là "falsy"
        */}
        {children ?? 'or'}
      </span>
    </div>
  )
}

export default SeparatorWithOr
