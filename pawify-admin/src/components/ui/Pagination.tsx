interface PaginationProps {
  currentPage: number
  totalPages: number
  onNextPage: () => void
  onPrevPage: () => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage
}: PaginationProps) => {
  return (
    <div className='flex items-center justify-center gap-4'>
      <button
        onClick={onPrevPage}
        className='bg-primary-accent rounded-lg py-2 px-4 cursor-pointer text-sm text-white hover:bg-primary-accent/80'
      >
        Anterior
      </button>
      <span className='text-sm text-white'>Página { currentPage + 1 } de { totalPages }</span>
      <button
        onClick={onNextPage}
        className='bg-primary-accent rounded-lg py-2 px-4 cursor-pointer text-sm text-white hover:bg-primary-accent/80'
      >
        Siguiente
      </button>
    </div>
  )
}